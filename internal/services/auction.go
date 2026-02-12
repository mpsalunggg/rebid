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

func (s *AuctionService) GetAllAuctions(ctx context.Context, filter *dto.FilterAuction) ([]dto.ResponseAuction, error) {
	return s.repo.GetAll(ctx, filter)
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

func (s *AuctionService) GetAuctionByID(ctx context.Context, auctionID string) (*dto.ResponseAuction, error) {
	auctionUUID, err := uuid.Parse(auctionID)
	if err != nil {
		return nil, pkg.NewError("invalid auction ID format", http.StatusBadRequest)
	}

	return s.repo.GetByID(ctx, auctionUUID)
}

func (s *AuctionService) DeleteAuction(ctx context.Context, auctionID string) error {
	auctionUUID, err := uuid.Parse(auctionID)
	if err != nil {
		return pkg.NewError("invalid auction ID format", http.StatusBadRequest)
	}

	return s.repo.Delete(ctx, auctionUUID)
}
