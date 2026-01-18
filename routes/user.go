package routes

import (
	"rebid/config"
	"rebid/handlers"
)

func SetupUserRoutes(router Router, cfg *config.Config, handler *handlers.Handler) {
	router.HandleFunc(apiPath("/users/register"), handler.RegisterUser)
	router.HandleFunc(apiPath("/users/login"), handler.LoginUser)
	router.HandleFuncWithAuth(apiPath("/users/me"), handler.GetCurrentUser, cfg)
}
