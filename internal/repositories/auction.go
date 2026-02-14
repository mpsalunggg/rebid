package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	database "rebid/internal/databases"
	"rebid/internal/dto"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type AuctionRepository struct {
	db *sql.DB
}

func NewAuctionRepository() *AuctionRepository {
	return &AuctionRepository{
		db: database.GetDB(),
	}
}
func (r *AuctionRepository) GetAll(ctx context.Context, filter *dto.FilterAuction) ([]dto.ResponseAuction, error) {
	query := `
		SELECT id, item_id, created_by, starting_price, current_price,
		       start_time, end_time, current_bidder_id,
		       status, created_at, updated_at
		FROM auctions
		WHERE 1=1
	`

	var args []interface{}
	argPos := 1

	if filter.Status != nil {
		query += fmt.Sprintf(" AND status = $%d", argPos)
		args = append(args, *filter.Status)
		argPos++
	}

	if filter.StartTime != nil {
		query += fmt.Sprintf(" AND start_time >= $%d", argPos)
		args = append(args, *filter.StartTime)
		argPos++
	}

	if filter.EndTime != nil {
		query += fmt.Sprintf(" AND end_time <= $%d", argPos)
		args = append(args, *filter.EndTime)
		argPos++
	}

	if filter.StartingPrice != nil {
		query += fmt.Sprintf(" AND starting_price >= $%d", argPos)
		args = append(args, *filter.StartingPrice)
		argPos++
	}

	query += " ORDER BY start_time DESC"

	if filter.Limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", filter.Limit)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var responses []dto.ResponseAuction

	for rows.Next() {

		var res dto.ResponseAuction

		err := rows.Scan(
			&res.ID,
			&res.ItemID,
			&res.CreatedBy,
			&res.StartingPrice,
			&res.CurrentPrice,
			&res.StartTime,
			&res.EndTime,
			&res.CurrentBidderID,
			&res.Status,
			&res.CreatedAt,
			&res.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		responses = append(responses, res)
	}

	return responses, nil
}

func (r *AuctionRepository) Create(ctx context.Context, auction *dto.CreateAuctionRequest, userID uuid.UUID) (*dto.ResponseAuction, error) {
	query := `
    INSERT INTO auctions (id, item_id, created_by, starting_price, current_price, start_time, end_time, status, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, $2, $3, $3, $4, $5, $6, NOW(), NOW())
    RETURNING id, item_id, created_by, starting_price, current_price, start_time, end_time, current_bidder_id, status, created_at, updated_at
`

	var response dto.ResponseAuction
	var (
		createdAt time.Time
		updatedAt time.Time
	)

	err := r.db.QueryRowContext(ctx, query, auction.ItemID, userID, auction.StartingPrice, auction.StartTime, auction.EndTime, auction.Status).Scan(
		&response.ID,
		&response.ItemID,
		&response.CreatedBy,
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
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Constraint == "unique_item_auction" {
				return nil, fmt.Errorf("auction for this item already exists")
			}
		}
		return nil, fmt.Errorf("failed to create auction: %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &response, nil
}

func (r *AuctionRepository) Update(ctx context.Context, auction *dto.UpdateAuctionRequest, auctionID uuid.UUID) (*dto.ResponseAuction, error) {
	query := `
		UPDATE auctions SET
			starting_price = $1,
			start_time     = $2,
			end_time       = $3,
			status         = $4,
			updated_at     = NOW()
		WHERE id = $5
		RETURNING id, item_id, created_by, starting_price, current_price, start_time, end_time, current_bidder_id, status, created_at, updated_at
	`

	var response dto.ResponseAuction
	var (
		createdAt time.Time
		updatedAt time.Time
	)

	err := r.db.QueryRowContext(ctx, query, auction.StartingPrice, auction.StartTime, auction.EndTime, auction.Status, auctionID).Scan(
		&response.ID,
		&response.ItemID,
		&response.CreatedBy,
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
		return nil, fmt.Errorf("failed to update auction, %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &response, nil
}

func (r *AuctionRepository) GetByID(ctx context.Context, auctionID uuid.UUID) (*dto.ResponseAuction, error) {
	query := `
		SELECT id, item_id, created_by, starting_price, current_price, start_time, end_time, current_bidder_id, status, created_at, updated_at
		FROM auctions
		WHERE id = $1
	`

	var response dto.ResponseAuction
	var (
		createdAt time.Time
		updatedAt time.Time
	)

	err := r.db.QueryRowContext(ctx, query, auctionID).Scan(
		&response.ID,
		&response.ItemID,
		&response.CreatedBy,
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
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("auction not found")
		}
		return nil, fmt.Errorf("failed to get auction by ID, %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &response, nil
}

func (r *AuctionRepository) Delete(ctx context.Context, auctionID uuid.UUID) error {
	query := `
		DELETE FROM auctions WHERE id = $1
	`

	_, err := r.db.ExecContext(ctx, query, auctionID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fmt.Errorf("auction not found")
		}
		return fmt.Errorf("failed to delete auction: %w", err)
	}
	return nil
}

func (r *AuctionRepository) GetCurrentPrice(ctx context.Context, auctionID uuid.UUID) (*dto.ResponseCurrentPrice, error) {
	query := `
		SELECT current_price
		FROM auctions
		WHERE id = $1
	`

	var response dto.ResponseCurrentPrice

	err := r.db.QueryRowContext(ctx, query, auctionID).Scan(
		&response.Amount,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("auction not found")
		}
		return nil, fmt.Errorf("failed to get current price: %w", err)
	}
	return &response, nil
}

func (r *AuctionRepository) UpdateCurrentPriceWithBidder(ctx context.Context, tx *sql.Tx, auctionID uuid.UUID, amount float64, bidderID uuid.UUID) error {
	q := `UPDATE auctions SET current_price = $1, current_bidder_id = $2, updated_at = NOW() WHERE id = $3`
	_, err := tx.ExecContext(ctx, q, amount, bidderID, auctionID)
	return err
}
