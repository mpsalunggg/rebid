package bootstrap

import (
	"database/sql"
	"rebid/internal/config"
	"rebid/internal/repositories"
	"rebid/internal/services"
	"rebid/internal/websocket"
)

type Dependencies struct {
	Hub            *websocket.Hub
	UserRepo       *repositories.UserRepository
	ItemRepo       *repositories.ItemRepository
	ItemImageRepo  *repositories.ItemImageRepository
	AuctionRepo    *repositories.AuctionRepository
	BidRepo        *repositories.BidRepository
	UserService    *services.UserService
	ItemService    *services.ItemService
	AuctionService *services.AuctionService
	BidService     *services.BidService
}

func BuildDependencies(cfg *config.Config, db *sql.DB) *Dependencies {
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

	return &Dependencies{
		Hub:            hub,
		UserRepo:       userRepo,
		ItemRepo:       itemRepo,
		ItemImageRepo:  itemImageRepo,
		AuctionRepo:    auctionRepo,
		BidRepo:        bidRepo,
		UserService:    userService,
		ItemService:    itemService,
		AuctionService: auctionService,
		BidService:     bidService,
	}
}
