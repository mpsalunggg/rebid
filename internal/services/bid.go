package services

import (
	"context"
	"fmt"
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/repositories"

	"github.com/google/uuid"
)

type BidService struct {
	repo        *repositories.BidRepository
	auctionRepo *repositories.AuctionRepository
	config      *config.Config
}

func NewBidService(cfg *config.Config) *BidService {
	return &BidService{
		repo:        repositories.NewBidRepository(),
		auctionRepo: repositories.NewAuctionRepository(),
		config:      cfg,
	}
}

func (s *BidService) CreateBid(ctx context.Context, bid *dto.CreateBidRequest, userID uuid.UUID) (*dto.ResponseBid, error) {
	currentPrice, err := s.auctionRepo.GetCurrentPrice(ctx, bid.AuctionID)
	if err != nil {
		return nil, err
	}

	if currentPrice.Amount >= bid.Amount {
		return nil, fmt.Errorf("bid amount must be greater than current price")
	}

	return s.repo.Create(ctx, bid, userID)
}
