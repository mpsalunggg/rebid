package routes

import (
	"database/sql"
	"net/http"
	"rebid/internal/config"
	"rebid/internal/handlers"
	"rebid/internal/middleware"
	"rebid/internal/repositories"
	"rebid/internal/services"
	"rebid/internal/websocket"
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
	corsHandler := middleware.CORS(r.cfg)
	return http.ListenAndServe(addr, corsHandler(r.mux))
}

const version = "/api/v1"

func apiPath(path string) string {
	return version + path
}

func SetupRoutes(cfg *config.Config, db *sql.DB) Router {
	router := NewRouter(cfg)
	hub := websocket.NewHub()

	itemImageRepo := repositories.NewItemImageRepository(db)
	userRepo := repositories.NewUserRepository(db)
	itemRepo := repositories.NewItemRepository(db, itemImageRepo)
	auctionRepo := repositories.NewAuctionRepository(db, itemImageRepo)
	bidRepo := repositories.NewBidRepository(db)

	userService := services.NewUserService(cfg, userRepo)
	itemService := services.NewItemService(cfg, itemRepo, itemImageRepo)
	auctionService := services.NewAuctionService(cfg, auctionRepo)
	bidService := services.NewBidService(cfg, db, bidRepo, auctionRepo)

	handler := handlers.NewHandler(cfg, hub, userService, itemService, auctionService, bidService)

	router.HandleFunc("/health", handler.HealthCheck)
	router.HandleFunc("/uploads/", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/uploads/", http.FileServer(http.Dir(cfg.UploadDir))).ServeHTTP(w, r)
	})

	SetupUserRoutes(router, cfg, handler)
	SetupItemRoutes(router, cfg, handler)
	SetupAuctionRoutes(router, cfg, handler, hub, auctionRepo)
	SetupBidRoutes(router, cfg, handler)
	return router
}
