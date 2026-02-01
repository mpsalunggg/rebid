package routes

import (
	"rebid/config"
	"rebid/handlers"
)

func SetupItemRoutes(router Router, cfg *config.Config, handler *handlers.Handler) {
	router.HandleFuncWithAuth(apiPath("/items/detail/{id}"), handler.GetItemByID, cfg)
	router.HandleFuncWithAuth(apiPath("/items/create"), handler.CreateItem, cfg)
	router.HandleFuncWithAuth(apiPath("/items/update/{id}"), handler.UpdateItem, cfg)
	router.HandleFuncWithAuth(apiPath("/items/delete/{id}"), handler.DeleteItem, cfg)
}
