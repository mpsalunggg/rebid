package repositories

import (
	"database/sql"
	"fmt"
	database "rebid/internal/databases"
	"rebid/internal/dto"
	"time"
)

type AuctionRepository struct {
	db *sql.DB
}

func NewAuctionRepository() *AuctionRepository {
	return &AuctionRepository{
		db: database.GetDB(),
	}
}

func (r *AuctionRepository) Create(auction *dto.CreateAuctionRequest) (*dto.ResponseAuction, error) {
	query := `
		INSERT INTO auctions (id, item_id, starting_price, current_price, start_time, end_time, status, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
		RETURNING id, item_id, starting_price, current_price, start_time, end_time, current_bidder_id, status, created_at, updated_at
	`

	var response dto.ResponseAuction
	var (
		createdAt time.Time
		updatedAt time.Time
	)

	err := r.db.QueryRow(query, auction.ItemID, auction.StartingPrice, auction.StartTime, auction.EndTime, auction.Status).Scan(
		&response.ID,
		&response.ItemID,
		&response.StartingPrice,
		&response.CurrentPrice,
		&response.StartTime,
		&response.EndTime,
		&response.CurrentBidderID,
		&response.Status,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create auction: %w", err)
	}

	return &response, nil
}
