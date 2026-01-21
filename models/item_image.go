package models

import (
	"time"

	"github.com/google/uuid"
)

type ItemImage struct {
	ID        uuid.UUID `json:"id" db:"id"`
	ItemID    uuid.UUID `json:"item_id" db:"item_id"`
	URL       string    `json:"url" db:"url"`
	Filename  string    `json:"filename" db:"filename"`
	MimeType  string    `json:"mime_type" db:"mime_type"`
	Size      int64     `json:"size" db:"size"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
