package services

import (
	"context"
	"database/sql"
	"fmt"
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/repositories"
	"time"

	"github.com/google/uuid"
)

type BidService struct {
	db          *sql.DB
	repo        *repositories.BidRepository
	auctionRepo *repositories.AuctionRepository
	config      *config.Config
}

func NewBidService(cfg *config.Config, db *sql.DB, repo *repositories.BidRepository, auctionRepo *repositories.AuctionRepository) *BidService {
	return &BidService{
		db:          db,
		repo:        repo,
		auctionRepo: auctionRepo,
		config:      cfg,
	}
}

func (s *BidService) CreateBid(ctx context.Context, bid *dto.CreateBidRequest, userID uuid.UUID) (*dto.ResponseBid, error) {
	eligibility, err := s.auctionRepo.GetAuctionForBid(ctx, bid.AuctionID)
	if err != nil {
		return nil, err
	}

	if eligibility.Status != "ACTIVE" {
		return nil, fmt.Errorf("auction is not active")
	}

	if time.Now().UTC().After(eligibility.EndTime.UTC()) {
		return nil, fmt.Errorf("auction has already ended")
	}

	if eligibility.CurrentPrice >= bid.Amount {
		return nil, fmt.Errorf("bid amount must be greater than current price")
	}

	tx, err := s.db.BeginTx(ctx, nil)
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

func (s *BidService) GetListBidByAuctionID(ctx context.Context, auctionID string) ([]dto.ResponseBidWithUser, error) {
	auctionUUID, err := uuid.Parse(auctionID)
	if err != nil {
		return nil, fmt.Errorf("invalid auction ID format: %w", err)
	}

	return s.repo.GetListBidByAuctionID(ctx, auctionUUID)
}
