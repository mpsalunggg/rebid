package dto

import (
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
	ID        string `json:"id"`
	ItemID    string `json:"item_id"`
	URL       string `json:"url"`
	Filename  string `json:"filename"`
	MimeType  string `json:"mime_type"`
	Size      int64  `json:"size"`
	CreatedAt string `json:"created_at"`
}
