package services

import (
	"context"
	"net/http"
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/repositories"
	"rebid/pkg"

	"github.com/google/uuid"
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

func (s *AuctionService) CreateAuction(ctx context.Context, auction *dto.CreateAuctionRequest, userID string) (*dto.ResponseAuction, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, pkg.NewError("invalid user ID format", http.StatusBadRequest)
	}

	return s.repo.Create(ctx, auction, userUUID)
}

func (s *AuctionService) UpdateAuction(ctx context.Context, auction *dto.UpdateAuctionRequest, auctionID string) (*dto.ResponseAuction, error) {
	auctionUUID, err := uuid.Parse(auctionID)
	if err != nil {
		return nil, pkg.NewError("invalid auction ID format", http.StatusBadRequest)
	}

	return s.repo.Update(ctx, auction, auctionUUID)
}
