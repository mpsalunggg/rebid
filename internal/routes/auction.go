package routes

import (
	"rebid/internal/config"
	"rebid/internal/handlers"
	"rebid/internal/repositories"
	"rebid/internal/websocket"
)

func SetupAuctionRoutes(router Router, cfg *config.Config, handler *handlers.Handler, hub *websocket.Hub) {
	auctionRepo := repositories.NewAuctionRepository()

	router.HandleFuncWithAuth(apiPath("/auctions"), handler.AuctionHandler, cfg)
	router.HandleFuncWithAuth(apiPath("/auctions/{id}"), handler.AuctionByIDHandler, cfg)
	router.HandleFunc(apiPath("/auctions/{id}/ws"), websocket.HandleAuctionWS(hub, cfg, auctionRepo))
}
