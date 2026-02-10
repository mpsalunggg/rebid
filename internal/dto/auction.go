package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateAuctionRequest struct {
	ItemID        uuid.UUID `json:"item_id"`
	StartingPrice float64   `json:"starting_price"`
	StartTime     time.Time `json:"start_time"`
	EndTime       time.Time `json:"end_time"`
	Status        string    `json:"status"`
}

type ResponseAuction struct {
	ID              uuid.UUID  `json:"id"`
	ItemID          uuid.UUID  `json:"item_id"`
	StartingPrice   float64    `json:"starting_price"`
	CurrentPrice    float64    `json:"current_price"`
	StartTime       time.Time  `json:"start_time"`
	EndTime         time.Time  `json:"end_time"`
	CurrentBidderID *uuid.UUID `json:"current_bidder_id,omitempty" db:"current_bidder_id"`
	Status          string     `json:"status"`
	CreatedAt       string     `json:"created_at"`
	UpdatedAt       string     `json:"updated_at"`
}
