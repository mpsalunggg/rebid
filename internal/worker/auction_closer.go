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
	hub *websocket.Hub,
) {
	c := cron.New(cron.WithSeconds())

	_, err := c.AddFunc(cronExpr, func() {
		runClose(auctionSvc, hub)
	})
	if err != nil {
		log.Printf("auction closer: invalid cron expression %q: %v — falling back to %s", cronExpr, err, defaultCronExpr)
		c.AddFunc(defaultCronExpr, func() {
			runClose(auctionSvc, hub)
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

func runClose(auctionSvc *services.AuctionService, hub *websocket.Hub) {
	closedIDs, err := auctionSvc.CloseExpiredAuctions(context.Background())
	if err != nil {
		log.Printf("auction closer: error closing expired auctions: %v", err)
		return
	}
	if len(closedIDs) == 0 {
		return
	}

	log.Printf("auction closer: closed %d auction(s)", len(closedIDs))
	broadcastEnded(hub, closedIDs)
}

func broadcastEnded(hub *websocket.Hub, ids []uuid.UUID) {
	payload := struct {
		Event  string `json:"event"`
		Change string `json:"change"`
	}{
		Event:  "subscribed",
		Change: websocket.ChangeAuctionEnded,
	}
	b, err := json.Marshal(payload)
	if err != nil {
		log.Printf("auction closer: marshal broadcast payload: %v", err)
		return
	}
	for _, id := range ids {
		hub.BroadcastToAuction(id, b)
	}
}
