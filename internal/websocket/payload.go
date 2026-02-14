package websocket

import (
	"rebid/internal/dto"

	"github.com/google/uuid"
)

type NewBidPayload struct {
	Event string          `json:"event"`
	Bid   dto.ResponseBid `json:"bid"`
}

type SubscribedPayload struct {
	Event           string              `json:"event"`
	Auction         dto.ResponseAuction `json:"auction"`
	CurrentPrice    float64             `json:"current_price"`
	CurrentBidderID *uuid.UUID          `json:"current_bidder_id"`
}
