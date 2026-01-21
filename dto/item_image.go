package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateItemImageRequest struct {
	ItemID   uuid.UUID `json:"item_id"`
	URL      string    `json:"url"`
	Filename string    `json:"filename"`
	MimeType string    `json:"mime_type"`
	Size     int64     `json:"size"`
}

type ItemImageResponse struct {
	ID        uuid.UUID `json:"id"`
	ItemID    uuid.UUID `json:"item_id"`
	URL       string    `json:"url"`
	Filename  string    `json:"filename"`
	MimeType  string    `json:"mime_type"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"created_at"`
}
