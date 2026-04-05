package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"rebid/internal/dto"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type AuctionRepository struct {
	db        *sql.DB
	imageRepo *ItemImageRepository
}

func NewAuctionRepository(db *sql.DB, imageRepo *ItemImageRepository) *AuctionRepository {
	return &AuctionRepository{
		db:        db,
		imageRepo: imageRepo,
	}
}
func (r *AuctionRepository) GetAll(ctx context.Context, filter *dto.FilterAuction) ([]dto.ResponseAuction, error) {
	query := `
		SELECT 
			a.id, a.item_id, a.created_by, a.starting_price, a.current_price,
			a.start_time, 
			a.end_time, 
			a.current_bidder_id,
			a.status, 
			a.created_at as auction_created_at, 
			a.updated_at as auction_updated_at,
			i.id, i.user_id, i.name, i.description,
			i.created_at as item_created_at, i.updated_at as item_updated_at,
			u.name, u.email
		FROM auctions a
		LEFT JOIN items i ON a.item_id = i.id
		LEFT JOIN users u ON a.created_by = u.id
		WHERE 1=1
	`

	var args []interface{}
	argPos := 1

	if filter.Status != nil {
		query += fmt.Sprintf(" AND a.status = $%d", argPos)
		args = append(args, *filter.Status)
		argPos++
	}

	if filter.StartTime != nil {
		query += fmt.Sprintf(" AND a.start_time >= $%d", argPos)
		args = append(args, *filter.StartTime)
		argPos++
	}

	if filter.EndTime != nil {
		query += fmt.Sprintf(" AND a.end_time <= $%d", argPos)
		args = append(args, *filter.EndTime)
		argPos++
	}

	if filter.StartingPrice != nil {
		query += fmt.Sprintf(" AND a.starting_price >= $%d", argPos)
		args = append(args, *filter.StartingPrice)
		argPos++
	}

	query += " ORDER BY a.created_at DESC"

	if filter.Limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", filter.Limit)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var responses []dto.ResponseAuction
	var itemIDs []uuid.UUID

	for rows.Next() {
		var res dto.ResponseAuction
		var item dto.ItemResponse
		var user dto.UserDetailResponse
		var (
			auctionCreatedAt time.Time
			auctionUpdatedAt time.Time
			itemCreatedAt    time.Time
			itemUpdatedAt    sql.NullTime
		)

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
			&auctionCreatedAt,
			&auctionUpdatedAt,

			&item.ID,
			&item.UserID,
			&item.Name,
			&item.Description,
			&itemCreatedAt,
			&itemUpdatedAt,

			&user.Name,
			&user.Email,
		)

		if err != nil {
			return nil, err
		}

		res.CreatedAt = auctionCreatedAt.Format(time.RFC3339)
		res.UpdatedAt = auctionUpdatedAt.Format(time.RFC3339)
		item.CreatedAt = itemCreatedAt.Format(time.RFC3339)
		if itemUpdatedAt.Valid {
			item.UpdatedAt = itemUpdatedAt.Time.Format(time.RFC3339)
		}

		item.Images = []dto.ItemImageResponse{}
		res.Item = &item
		res.User = user

		responses = append(responses, res)
		itemIDs = append(itemIDs, res.ItemID)
	}

	if len(itemIDs) > 0 {
		imagesMap, err := r.imageRepo.GetByItemIDs(itemIDs)
		if err != nil {
		} else {
			for i := range responses {
				if images, found := imagesMap[responses[i].ItemID]; found {
					responses[i].Item.Images = images
				}
			}
		}
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
		SELECT 
			a.id, 
			a.item_id, 
			a.created_by, 
			a.starting_price, 
			a.current_price, 
			a.start_time, 
			a.end_time, 
			a.current_bidder_id, 
			a.status, 
			a.created_at, 
			a.updated_at,
			u.name as created_by_name,
			u.email as created_by_email,
			i.id as item_id,
			i.user_id,
			i.name as item_name,
			i.description as item_description,
			i.created_at as item_created_at,
			i.updated_at as item_updated_at
		FROM auctions a
		LEFT JOIN users u ON a.created_by = u.id
		LEFT JOIN items i ON a.item_id = i.id
		WHERE a.id = $1
	`

	var response dto.ResponseAuction
	var (
		createdAt time.Time
		updatedAt time.Time
		user      dto.UserDetailResponse
		item      dto.ItemResponse
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
		&user.Name,
		&user.Email,
		&item.ID,
		&item.UserID,
		&item.Name,
		&item.Description,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("auction not found")
		}
		return nil, fmt.Errorf("failed to get auction by ID, %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)
	response.User = user

	item.Images = []dto.ItemImageResponse{}
	if item.ID != "" {
		itemUUID, err := uuid.Parse(item.ID)
		if err == nil {
			images, err := r.imageRepo.GetByItemID(itemUUID)
			if err == nil {
				item.Images = images
			}
		}

		response.Item = &item
	}

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

func (r *AuctionRepository) CloseExpiredAuctions(ctx context.Context) ([]uuid.UUID, error) {
	const q = `
		UPDATE auctions
		SET status = 'ENDED', updated_at = NOW()
		WHERE status = 'ACTIVE' AND end_time <= NOW()
		RETURNING id
	`

	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("close expired auctions: %w", err)
	}
	defer rows.Close()

	var ids []uuid.UUID
	for rows.Next() {
		var id uuid.UUID
		if err := rows.Scan(&id); err != nil {
			return nil, fmt.Errorf("close expired auctions scan: %w", err)
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}

type AuctionBidEligibility struct {
	CurrentPrice float64
	Status       string
	EndTime      time.Time
}

func (r *AuctionRepository) GetAuctionForBid(ctx context.Context, auctionID uuid.UUID) (*AuctionBidEligibility, error) {
	const q = `SELECT current_price, status, end_time FROM auctions WHERE id = $1`

	var e AuctionBidEligibility
	err := r.db.QueryRowContext(ctx, q, auctionID).Scan(&e.CurrentPrice, &e.Status, &e.EndTime)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("auction not found")
		}
		return nil, fmt.Errorf("get auction for bid: %w", err)
	}
	return &e, nil
}
