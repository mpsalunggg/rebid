package handlers

import (
	"rebid/internal/config"
	"rebid/internal/services"
	"rebid/internal/websocket"
)

type Handler struct {
	cfg            *config.Config
	userService    *services.UserService
	itemService    *services.ItemService
	auctionService *services.AuctionService
	bidService     *services.BidService
	wsHub          *websocket.Hub
}

func NewHandler(cfg *config.Config, wsHub *websocket.Hub) *Handler {
	return &Handler{
		cfg:            cfg,
		userService:    services.NewUserService(cfg),
		itemService:    services.NewItemService(cfg),
		auctionService: services.NewAuctionService(cfg),
		bidService:     services.NewBidService(cfg),
		wsHub:          wsHub,
	}
}
