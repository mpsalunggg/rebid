package worker

import (
	"context"
	"encoding/json"
	"log"
	"rebid/internal/services"
	"rebid/internal/websocket"

	"github.com/google/uuid"
	"github.com/robfig/cron/v3"
)

const defaultCronExpr = "*/30 * * * * *"

func StartAuctionCloser(
	d context.Context,
	cronExpr string,
	auctionSvc *services.AuctionService,
	bidSvc *services.BidService,
	hub *websocket.Hub,
) {
	c := cron.New(cron.WithSeconds())

	_, err := c.AddFunc(cronExpr, func() {
		runClose(auctionSvc, bidSvc, hub)
	})
	if err != nil {
		log.Printf("auction closer: invalid cron expression %q: %v — falling back to %s", cronExpr, err, defaultCronExpr)
		c.AddFunc(defaultCronExpr, func() {
			runClose(auctionSvc, bidSvc, hub)
		})
	}

	c.Start()
	log.Printf("auction closer: started (cron=%q)", cronExpr)

	go func() {
		<-d.Done()
		log.Println("auction closer: shutdown signal received, waiting for running job...")
		stopCtx := c.Stop()
		<-stopCtx.Done()
		log.Println("auction closer: stopped")
	}()
}

func runClose(auctionSvc *services.AuctionService, bidSvc *services.BidService, hub *websocket.Hub) {
	closedIDs, err := auctionSvc.CloseExpiredAuctions(context.Background())
	if err != nil {
		log.Printf("auction closer: error closing expired auctions: %v", err)
		return
	}
	if len(closedIDs) == 0 {
		return
	}

	log.Printf("auction closer: closed %d auction(s)", len(closedIDs))
	broadcastEnded(auctionSvc, bidSvc, hub, closedIDs)
}

func broadcastEnded(
	auctionSvc *services.AuctionService,
	bidSvc *services.BidService,
	hub *websocket.Hub,
	ids []uuid.UUID,
) {
	ctx := context.Background()
	for _, id := range ids {
		auction, err := auctionSvc.GetAuctionByID(ctx, id.String())
		if err != nil {
			log.Printf("auction closer: get auction %s: %v", id, err)
			continue
		}

		bids, err := bidSvc.GetListBidByAuctionID(ctx, id.String())
		if err != nil {
			log.Printf("auction closer: get bids %s: %v", id, err)
			continue
		}

		payload := websocket.SubscribedPayload{
			Event:           "auction",
			Change:          websocket.ChangeAuctionEnded,
			Auction:         *auction,
			CurrentPrice:    auction.CurrentPrice,
			CurrentBidderID: auction.CurrentBidderID,
			Bids:            bids,
		}

		b, err := json.Marshal(payload)
		if err != nil {
			log.Printf("auction closer: marshal payload %s: %v", id, err)
			continue
		}
		hub.BroadcastToAuction(id, b)
	}
}
