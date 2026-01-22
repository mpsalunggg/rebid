package repositories

import (
	"database/sql"
	"fmt"
	database "rebid/databases"
	"rebid/dto"
	"time"

	"github.com/google/uuid"
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
	var createdAt time.Time
	err := r.db.QueryRow(query, itemImage.ItemID, itemImage.URL, itemImage.Filename, itemImage.MimeType, itemImage.Size).Scan(
		&response.ID,
		&response.ItemID,
		&response.URL,
		&response.Filename,
		&response.MimeType,
		&response.Size,
		&createdAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create item image: %w", err)
	}

	response.CreatedAt = createdAt.Format(time.RFC3339)
	return &response, nil
}

func (r *ItemImageRepository) GetByItemID(itemID uuid.UUID) ([]dto.ItemImageResponse, error) {
	query := `
		SELECT id, item_id, url, filename, mime_type, size, created_at
		FROM item_images
		WHERE item_id = $1
		ORDER BY created_at ASC
	`

	rows, err := r.db.Query(query, itemID)
	if err != nil {
		return nil, fmt.Errorf("failed to get item images: %w", err)
	}
	defer rows.Close()

	var images []dto.ItemImageResponse
	for rows.Next() {
		var img dto.ItemImageResponse
		var createdAt time.Time
		err := rows.Scan(
			&img.ID,
			&img.ItemID,
			&img.URL,
			&img.Filename,
			&img.MimeType,
			&img.Size,
			&createdAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan item image: %w", err)
		}
		img.CreatedAt = createdAt.Format(time.RFC3339)
		images = append(images, img)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating item images: %w", err)
	}

	return images, nil
}
