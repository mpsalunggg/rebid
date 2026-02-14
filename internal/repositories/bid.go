package repositories

import (
	"context"
	"database/sql"
	"fmt"
	database "rebid/internal/databases"
	"rebid/internal/dto"
	"time"

	"github.com/google/uuid"
)

type BidRepository struct {
	db *sql.DB
}

func NewBidRepository() *BidRepository {
	return &BidRepository{
		db: database.GetDB(),
	}
}

func (r *BidRepository) Create(ctx context.Context, tx *sql.Tx, bid *dto.CreateBidRequest, userID uuid.UUID) (*dto.ResponseBid, error) {
	query := `
		INSERT INTO bids (id, auction_id, user_id, amount, bid_time)
		VALUES (gen_random_uuid(), $1, $2, $3, NOW())
		RETURNING id, auction_id, user_id, amount, bid_time
	`
	var response dto.ResponseBid
	var bidTime time.Time
	err := tx.QueryRowContext(ctx, query, bid.AuctionID, userID, bid.Amount).Scan(
		&response.ID,
		&response.AuctionID,
		&response.UserID,
		&response.Amount,
		&bidTime,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create bid: %w", err)
	}
	response.CreatedAt = bidTime.Format(time.RFC3339)
	return &response, nil
}
