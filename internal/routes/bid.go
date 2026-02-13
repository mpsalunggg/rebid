package routes

import (
	"rebid/internal/config"
	"rebid/internal/handlers"
)

func SetupBidRoutes(router Router, cfg *config.Config, handler *handlers.Handler) {
	router.HandleFuncWithAuth(apiPath("/bids"), handler.BidHandler, cfg)
}
