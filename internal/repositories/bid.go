package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"rebid/internal/dto"
	"time"

	"github.com/google/uuid"
)

type BidRepository struct {
	db *sql.DB
}

func NewBidRepository(db *sql.DB) *BidRepository {
	return &BidRepository{
		db: db,
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

func (r *BidRepository) GetListBidByAuctionID(ctx context.Context, auctionID uuid.UUID) ([]dto.ResponseBidWithUser, error) {
	query := `
		SELECT b.id, b.user_id, b.amount, b.bid_time, u.name, u.email
		FROM bids b
		LEFT JOIN users u ON b.user_id = u.id
		WHERE b.auction_id = $1
		ORDER BY b.bid_time DESC
	`
	rows, err := r.db.QueryContext(ctx, query, auctionID)
	if err != nil {
		return nil, fmt.Errorf("failed to get list bid by auction ID: %w", err)
	}
	defer rows.Close()

	var response []dto.ResponseBidWithUser
	for rows.Next() {
		var bid dto.ResponseBidWithUser
		var bidTime time.Time
		if err := rows.Scan(
			&bid.ID,
			&bid.UserID,
			&bid.Amount,
			&bidTime,
			&bid.User.Name,
			&bid.User.Email,
		); err != nil {
			return nil, fmt.Errorf("failed to scan bid row: %w", err)
		}
		bid.CreatedAt = bidTime.Format(time.RFC3339)
		response = append(response, bid)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed during rows iteration: %w", err)
	}

	return response, nil
}
