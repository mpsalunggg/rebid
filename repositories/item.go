package repositories

import (
	"database/sql"
	"errors"
	"fmt"
	database "rebid/databases"
	"rebid/dto"
	"time"

	"github.com/google/uuid"
)

type ItemRepository struct {
	db *sql.DB
}

func NewItemRepository() *ItemRepository {
	return &ItemRepository{
		db: database.GetDB(),
	}
}

func (r *ItemRepository) Create(item *dto.CreateItemRequest, userID uuid.UUID) (*dto.ItemResponse, error) {
	query := `
		INSERT INTO items (id, user_id, name, description, starting_price, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
		RETURNING id, user_id, name, description, starting_price, created_at, updated_at
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
		item.StartingPrice,
	).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&response.StartingPrice,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("failed to create item: %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	response.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &response, nil
}

func (r *ItemRepository) GetByID(itemID uuid.UUID) (*dto.ItemResponse, error) {
	query := `
		SELECT id, user_id, name, description, starting_price, created_at, updated_at
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
		&response.StartingPrice,
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

	imageRepo := NewItemImageRepository()
	images, err := imageRepo.GetByItemID(itemID)
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
			starting_price = CASE WHEN $4 > 0 THEN $4 ELSE starting_price END,
			updated_at = NOW()
		WHERE id = $1
		RETURNING id, user_id, name, description, starting_price, created_at, updated_at
	`

	var response dto.ItemResponse
	var createdAt, updatedAt time.Time

	err := r.db.QueryRow(query, itemId, req.Name, req.Description, req.StartingPrice).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&response.StartingPrice,
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
