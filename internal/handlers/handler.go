package handlers

import (
	"rebid/internal/config"
	"rebid/internal/services"
)

type Handler struct {
	cfg            *config.Config
	userService    *services.UserService
	itemService    *services.ItemService
	auctionService *services.AuctionService
}

func NewHandler(cfg *config.Config) *Handler {
	return &Handler{
		cfg:            cfg,
		userService:    services.NewUserService(cfg),
		itemService:    services.NewItemService(cfg),
		auctionService: services.NewAuctionService(cfg),
	}
}
