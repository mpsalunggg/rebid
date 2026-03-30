package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"rebid/internal/dto"
	"time"

	"github.com/google/uuid"
)

type ItemRepository struct {
	db        *sql.DB
	imageRepo *ItemImageRepository
}

func NewItemRepository(db *sql.DB, imageRepo *ItemImageRepository) *ItemRepository {
	return &ItemRepository{
		db:        db,
		imageRepo: imageRepo,
	}
}

func (r *ItemRepository) CountAll(ctx context.Context, userID uuid.UUID) (int64, error) {
	var n int64

	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM items WHERE user_id = $1", userID).Scan(&n)
	if err != nil {
		return 0, fmt.Errorf("failed to count all items: %w", err)
	}

	return n, nil
}

func (r *ItemRepository) GetAll(ctx context.Context, offset, limit int, userID uuid.UUID) ([]dto.ItemResponse, error) {
	query := `
		SELECT id, user_id, name, description, created_at, updated_at
		FROM items
		WHERE user_id = $3
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.db.QueryContext(ctx, query, limit, offset, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get all items: %w", err)
	}
	defer rows.Close()

	var items []dto.ItemResponse
	for rows.Next() {
		var item dto.ItemResponse
		var createdAt time.Time
		var updatedAt sql.NullTime
		var id uuid.UUID
		if err := rows.Scan(
			&id,
			&item.UserID,
			&item.Name,
			&item.Description,
			&createdAt,
			&updatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan item: %w", err)
		}

		item.ID = id.String()
		item.CreatedAt = createdAt.Format(time.RFC3339)
		if updatedAt.Valid {
			item.UpdatedAt = updatedAt.Time.Format(time.RFC3339)
		} else {
			item.UpdatedAt = ""
		}

		images, err := r.imageRepo.GetByItemID(id)
		if err != nil {
			return nil, fmt.Errorf("failed to get images: %w", err)
		} else {
			item.Images = images
		}

		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to iterate items: %w", err)
	}

	return items, nil
}

func (r *ItemRepository) GetMyItems(ctx context.Context, userID uuid.UUID) ([]dto.MyItemResponse, error) {
	query := `
		SELECT id, name
		FROM items
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get my items: %w", err)
	}

	defer rows.Close()

	var items []dto.MyItemResponse
	for rows.Next() {
		var item dto.MyItemResponse
		err := rows.Scan(&item.ID, &item.Name)
		if err != nil {
			return nil, fmt.Errorf("failed to scan item: %w", err)
		}
		items = append(items, item)
	}

	return items, nil
}

func (r *ItemRepository) Create(item *dto.CreateItemRequest, userID uuid.UUID) (*dto.ItemResponse, error) {
	query := `
		INSERT INTO items (id, user_id, name, description, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
		RETURNING id, user_id, name, description, created_at, updated_at
	`

	var response dto.ItemResponse
	var (
		createdAt time.Time
		updatedAt time.Time
	)

	err := r.db.QueryRow(
		query,
		userID,
		item.Name,
		item.Description,
	).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create item: %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &response, nil
}

func (r *ItemRepository) GetByID(itemID uuid.UUID) (*dto.ItemResponse, error) {
	query := `
		SELECT id, user_id, name, description, created_at, updated_at
		FROM items
		WHERE id = $1
	`

	var response dto.ItemResponse
	var (
		createdAt time.Time
		updatedAt sql.NullTime
	)

	err := r.db.QueryRow(query, itemID).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("item not found")
		}
		return nil, fmt.Errorf("failed to get item by ID: %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	if updatedAt.Valid {
		response.UpdatedAt = updatedAt.Time.Format(time.RFC3339)
	} else {
		response.UpdatedAt = ""
	}

	images, err := r.imageRepo.GetByItemID(itemID)
	if err != nil {
		response.Images = []dto.ItemImageResponse{}
	} else {
		response.Images = images
	}

	return &response, nil
}

func (r *ItemRepository) Update(itemId uuid.UUID, req *dto.UpdateItemRequest) (*dto.ItemResponse, error) {
	query := `
		UPDATE items
		SET name = COALESCE(NULLIF($2, ''), name),
			description = COALESCE(NULLIF($3, ''), description),
			updated_at = NOW()
		WHERE id = $1
		RETURNING id, user_id, name, description, created_at, updated_at
	`

	var response dto.ItemResponse
	var createdAt, updatedAt time.Time

	err := r.db.QueryRow(query, itemId, req.Name, req.Description).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("item not found")
		}
		return nil, fmt.Errorf("failed to update item: %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)

	return &response, nil
}

func (r *ItemRepository) Delete(itemID uuid.UUID) error {
	query := `DELETE FROM items WHERE id = $1`

	result, err := r.db.Exec(query, itemID)
	if err != nil {
		return fmt.Errorf("failed to delete item: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("item not found")
	}

	return nil
}

func (r *ItemRepository) IsOwner(itemID, userID uuid.UUID) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM items WHERE id = $1 AND user_id = $2)`
	var exists bool
	err := r.db.QueryRow(query, itemID, userID).Scan(&exists)
	return exists, err
}
