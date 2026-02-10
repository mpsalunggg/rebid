package models

import (
	"time"

	"github.com/google/uuid"
)

type AuctionStatus string

const (
	AuctionScheduled AuctionStatus = "SCHEDULED"
	AuctionActive    AuctionStatus = "ACTIVE"
	AuctionEnded     AuctionStatus = "ENDED"
	AuctionCancelled AuctionStatus = "CANCELLED"
)

type Auction struct {
	ID              uuid.UUID     `json:"id" db:"id"`
	CreatedBy       uuid.UUID     `json:"created_by" db:"created_by"`
	ItemID          uuid.UUID     `json:"item_id" db:"item_id"`
	StartingPrice   float64       `json:"starting_price" db:"starting_price"`
	CurrentPrice    float64       `json:"current_price" db:"current_price"`
	StartTime       time.Time     `json:"start_time" db:"start_time"`
	EndTime         time.Time     `json:"end_time" db:"end_time"`
	CurrentBidderID *uuid.UUID    `json:"current_bidder_id,omitempty" db:"current_bidder_id"`
	Status          AuctionStatus `json:"status" db:"status"`
	CreatedAt       time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt       *time.Time    `json:"updated_at,omitempty" db:"updated_at"`
}
