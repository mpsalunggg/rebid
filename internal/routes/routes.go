package routes

import (
	"net/http"
	"rebid/internal/config"
	"rebid/internal/handlers"
	"rebid/internal/middleware"
)

type Router interface {
	HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request))
	HandleFuncWithAuth(pattern string, handler func(http.ResponseWriter, *http.Request), cfg *config.Config)
	Listen(addr string) error
}

type SimpleRouter struct {
	mux *http.ServeMux
	cfg *config.Config
}

func NewRouter(cfg *config.Config) *SimpleRouter {
	return &SimpleRouter{
		mux: http.NewServeMux(),
		cfg: cfg,
	}
}

func (r *SimpleRouter) HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	r.mux.HandleFunc(pattern, handler)
}

func (r *SimpleRouter) HandleFuncWithAuth(pattern string, handler func(http.ResponseWriter, *http.Request), cfg *config.Config) {
	authMiddleware := middleware.AuthMiddleware(cfg)
	handlerFunc := http.HandlerFunc(handler)
	protectedHandler := authMiddleware(handlerFunc)
	r.mux.Handle(pattern, protectedHandler)
}

func (r *SimpleRouter) Listen(addr string) error {
	return http.ListenAndServe(addr, r.mux)
}

const version = "/api/v1"

func apiPath(path string) string {
	return version + path
}

func SetupRoutes(cfg *config.Config) Router {
	router := NewRouter(cfg)
	handler := handlers.NewHandler(cfg)

	router.HandleFunc("/health", handler.HealthCheck)
	router.HandleFunc("/uploads/", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/uploads/", http.FileServer(http.Dir(cfg.UploadDir))).ServeHTTP(w, r)
	})

	SetupUserRoutes(router, cfg, handler)
	SetupItemRoutes(router, cfg, handler)
	SetupAuctionRoutes(router, cfg, handler)
	return router
}
