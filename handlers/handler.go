package handlers

import (
	"rebid/config"
	"rebid/services"
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
