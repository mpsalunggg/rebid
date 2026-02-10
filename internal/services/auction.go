package services

import (
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/repositories"
)

type AuctionService struct {
	config *config.Config
	repo   *repositories.AuctionRepository
}

func NewAuctionService(cfg *config.Config) *AuctionService {
	return &AuctionService{
		config: cfg,
		repo:   repositories.NewAuctionRepository(),
	}
}

func (s *AuctionService) CreateAuction(auction *dto.CreateAuctionRequest) (*dto.ResponseAuction, error) {
	return s.repo.Create(auction)
}
