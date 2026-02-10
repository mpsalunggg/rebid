package routes

import (
	"rebid/internal/config"
	"rebid/internal/handlers"
)

func SetupAuctionRoutes(router Router, cfg *config.Config, handler *handlers.Handler) {
	router.HandleFuncWithAuth(apiPath("/auctions/create"), handler.CreateAuction, cfg)
}
