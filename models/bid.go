package models

import (
	"time"

	"github.com/google/uuid"
)

type Bid struct {
	ID        uuid.UUID `json:"id" db:"id"`
	AuctionID uuid.UUID `json:"auction_id" db:"auction_id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Amount    float64   `json:"amount" db:"amount"`
	BidTime   time.Time `json:"bid_time" db:"bid_time"`
}
