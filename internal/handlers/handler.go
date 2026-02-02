package handlers

import (
	"rebid/internal/config"
	"rebid/internal/services"
)

type Handler struct {
	cfg         *config.Config
	userService *services.UserService
	itemService *services.ItemService
}

func NewHandler(cfg *config.Config) *Handler {
	return &Handler{
		cfg:         cfg,
		userService: services.NewUserService(cfg),
		itemService: services.NewItemService(cfg),
	}
}
