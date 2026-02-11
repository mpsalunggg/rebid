package routes

import (
	"rebid/internal/config"
	"rebid/internal/handlers"
)

func SetupAuctionRoutes(router Router, cfg *config.Config, handler *handlers.Handler) {
	router.HandleFuncWithAuth(apiPath("/auctions"), handler.AuctionHandler, cfg)
	router.HandleFuncWithAuth(apiPath("/auctions/{id}"), handler.AuctionByIDHandler, cfg)
}
