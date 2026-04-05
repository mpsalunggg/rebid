package services

import (
	"context"
	"fmt"
	"net/http"
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/repositories"
	"rebid/pkg"
	"strings"

	"github.com/google/uuid"
)

type AuctionService struct {
	config *config.Config
	repo   *repositories.AuctionRepository
}

func NewAuctionService(cfg *config.Config, auctionRepo *repositories.AuctionRepository) *AuctionService {
	return &AuctionService{
		config: cfg,
		repo:   auctionRepo,
	}
}

func (s *AuctionService) GetAllAuctions(ctx context.Context, filter *dto.FilterAuction) ([]dto.ResponseAuction, error) {
	return s.repo.GetAll(ctx, filter)
}

func (s *AuctionService) CreateAuction(ctx context.Context, auction *dto.CreateAuctionRequest, userID uuid.UUID) (*dto.ResponseAuction, error) {
	return s.repo.Create(ctx, auction, userID)
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

	auction, err := s.repo.GetByID(ctx, auctionUUID)
	if err != nil {
		return nil, err
	}
	if auction.Item != nil {
		baseURL := strings.TrimSuffix(s.config.BaseURL, "/")
		for i := range auction.Item.Images {
			path := strings.TrimPrefix(auction.Item.Images[i].URL, "/")
			auction.Item.Images[i].URL = fmt.Sprintf("%s/%s", baseURL, path)
		}
	}
	return auction, nil
}

func (s *AuctionService) DeleteAuction(ctx context.Context, auctionID string) error {
	auctionUUID, err := uuid.Parse(auctionID)
	if err != nil {
		return pkg.NewError("invalid auction ID format", http.StatusBadRequest)
	}

	return s.repo.Delete(ctx, auctionUUID)
}

func (s *AuctionService) CloseExpiredAuctions(ctx context.Context) ([]uuid.UUID, error) {
	return s.repo.CloseExpiredAuctions(ctx)
}
