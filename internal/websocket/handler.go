package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/repositories"
	"rebid/pkg"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleAuctionWS(hub *Hub, cfg *config.Config, auctionRepo *repositories.AuctionRepository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auctionIDStr := r.PathValue("id")
		if auctionIDStr == "" {
			pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("auction id required"))
			return
		}
		auctionID, err := uuid.Parse(auctionIDStr)
		if err != nil {
			pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("invalid auction id"))
			return
		}

		token := r.URL.Query().Get("token")
		if token == "" {
			pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("token required"))
			return
		}
		claims, err := pkg.ParseToken(token, cfg.JWTSecret)
		if err != nil {
			pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("invalid token"))
			return
		}
		_, err = uuid.Parse(claims.UserID)
		if err != nil {
			pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("invalid user"))
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("ws upgrade: %v", err)
			return
		}
		defer conn.Close()

		client := &Client{
			AuctionID: auctionID,
			Send:      make(chan []byte, 256),
		}
		hub.Register(auctionID, client)
		defer hub.Unregister(auctionID, client)

		ctx := r.Context()
		var response dto.ResponseAuction
		if auctionRepo != nil {
			if res, err := auctionRepo.GetByID(ctx, auctionID); err == nil {
				response = *res
			}
		}

		msg := SubscribedPayload{
			Event:           "subscribed",
			Auction:         response,
			CurrentPrice:    response.CurrentPrice,
			CurrentBidderID: response.CurrentBidderID,
		}
		b, _ := json.Marshal(msg)
		if err := conn.WriteMessage(websocket.TextMessage, b); err != nil {
			return
		}

		go func() {
			for b := range client.Send {
				if err := conn.WriteMessage(websocket.TextMessage, b); err != nil {
					return
				}
			}
		}()

		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				break
			}
		}
	}
}
