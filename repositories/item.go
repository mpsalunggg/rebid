package repositories

import (
	"database/sql"
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
		INSERT INTO items (id, user_id, name, description, image, starting_price, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, user_id, name, description, image, starting_price, created_at, updated_at
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
		item.Image,
		item.StartingPrice,
	).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&response.Image,
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

func (r *ItemRepository) GetByID(userID uuid.UUID) (*dto.ItemResponse, error) {
	query := `
		SELECT id, user_id, name, description, image, starting_price, created_at, updated_at
		FROM items
		WHERE id = $1
	`

	var response dto.ItemResponse
	err := r.db.QueryRow(query, userID).Scan(
		&response.ID,
		&response.UserID,
		&response.Name,
		&response.Description,
		&response.Image,
		&response.StartingPrice,
		&response.CreatedAt,
		&response.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get item by ID: %w", err)
	}

	return &response, nil
}
