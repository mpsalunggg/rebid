package dto

import (
	"errors"

	"github.com/google/uuid"
)

type CreateBidRequest struct {
	AuctionID uuid.UUID `json:"auction_id"`
	Amount    float64   `json:"amount"`
}

type ResponseBid struct {
	ID        uuid.UUID `json:"id"`
	AuctionID uuid.UUID `json:"auction_id"`
	UserID    uuid.UUID `json:"user_id"`
	Amount    float64   `json:"amount"`
	CreatedAt string    `json:"created_at"`
}

func (r *CreateBidRequest) Validate() error {
	if r.AuctionID == uuid.Nil {
		return errors.New("auction ID is required")
	}
	if r.Amount <= 0 {
		return errors.New("amount must be greater than 0")
	}
	return nil
}
