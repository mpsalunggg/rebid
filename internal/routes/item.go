package routes

import (
	"rebid/internal/config"
	"rebid/internal/handlers"
)

func SetupItemRoutes(router Router, cfg *config.Config, handler *handlers.Handler) {
	router.HandleFuncWithAuth("GET "+apiPath("/items"), handler.GetAllItems, cfg)
	router.HandleFuncWithAuth("GET "+apiPath("/items/list"), handler.GetMyItems, cfg)
	router.HandleFuncWithAuth("POST "+apiPath("/items"), handler.CreateItem, cfg)

	router.HandleFuncWithAuth("GET "+apiPath("/items/{id}"), handler.GetItemByID, cfg)
	router.HandleFuncWithAuth("PUT "+apiPath("/items/{id}"), handler.UpdateItem, cfg)
	router.HandleFuncWithAuth("PATCH "+apiPath("/items/{id}"), handler.UpdateItem, cfg)
	router.HandleFuncWithAuth("DELETE "+apiPath("/items/{id}"), handler.DeleteItem, cfg)
}
