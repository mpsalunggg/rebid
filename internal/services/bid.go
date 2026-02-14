package services

import (
	"context"
	"fmt"
	"rebid/internal/config"
	database "rebid/internal/databases"
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

	db := database.GetDB()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	createdBid, err := s.repo.Create(ctx, tx, bid, userID)
	if err != nil {
		return nil, err
	}

	err = s.auctionRepo.UpdateCurrentPriceWithBidder(ctx, tx, bid.AuctionID, bid.Amount, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to update auction: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit: %w", err)
	}

	return createdBid, nil
}
