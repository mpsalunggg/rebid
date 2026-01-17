package routes

import (
	"rebid/handlers"
)

func SetupUserRoutes(router Router) {
	router.HandleFunc(apiPath("/users/register"), handlers.RegisterUser)
	router.HandleFunc(apiPath("/users/login"), handlers.LoginUser)
}
