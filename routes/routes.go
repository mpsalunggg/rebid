package routes

import (
	"net/http"
	"rebid/handlers"
)

type Router interface {
	HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request))
	Listen(addr string) error
}

type SimpleRouter struct {
	mux *http.ServeMux
}

func NewRouter() *SimpleRouter {
	return &SimpleRouter{
		mux: http.NewServeMux(),
	}
}

func (r *SimpleRouter) HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	r.mux.HandleFunc(pattern, handler)
}

func (r *SimpleRouter) Listen(addr string) error {
	return http.ListenAndServe(addr, r.mux)
}

func SetupRoutes() Router {
	router := NewRouter()

	router.HandleFunc("/health", handlers.HealthCheck)

	return router
}
