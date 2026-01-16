package models

import (
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID            uuid.UUID  `json:"id" db:"id"`
	UserID        uuid.UUID  `json:"user_id" db:"user_id"`
	Name          string     `json:"name" db:"name"`
	Description   string     `json:"description" db:"description"`
	Image         *string    `json:"image" db:"image"` // Nullable
	StartingPrice float64    `json:"starting_price" db:"starting_price"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt     *time.Time `json:"updated_at,omitempty" db:"updated_at"`
}
