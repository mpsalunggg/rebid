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
