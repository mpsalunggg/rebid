package repositories

import (
	"database/sql"
	"fmt"
	database "rebid/databases"
	"rebid/dto"
)

type ItemImageRepository struct {
	db *sql.DB
}

func NewItemImageRepository() *ItemImageRepository {
	return &ItemImageRepository{
		db: database.GetDB(),
	}
}

func (r *ItemImageRepository) Create(itemImage *dto.CreateItemImageRequest) (*dto.ItemImageResponse, error) {
	query := `
		INSERT INTO item_images (id, item_id, url, filename, mime_type, size, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
		RETURNING id, item_id, url, filename, mime_type, size, created_at
	`

	var response dto.ItemImageResponse
	err := r.db.QueryRow(query, itemImage.ItemID, itemImage.URL, itemImage.Filename, itemImage.MimeType, itemImage.Size).Scan(
		&response.ID,
		&response.ItemID,
		&response.URL,
		&response.Filename,
		&response.MimeType,
		&response.Size,
		&response.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create item image: %w", err)
	}

	return &response, nil
}
