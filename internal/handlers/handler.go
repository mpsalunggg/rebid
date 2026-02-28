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

func NewHandler(
	cfg *config.Config,
	wsHub *websocket.Hub,
	userService *services.UserService,
	itemService *services.ItemService,
	auctionService *services.AuctionService,
	bidService *services.BidService,
) *Handler {
	return &Handler{
		cfg:            cfg,
		userService:    userService,
		itemService:    itemService,
		auctionService: auctionService,
		bidService:     bidService,
		wsHub:          wsHub,
	}
}
