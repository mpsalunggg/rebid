package websocket

import (
	"rebid/internal/dto"

	"github.com/google/uuid"
)

const ChangeConnect = "connect"
const ChangeNewBid = "new_bid"

type NewBidPayload struct {
	Event string          `json:"event"`
	Bid   dto.ResponseBid `json:"bid"`
}

type SubscribedPayload struct {
	Event           string                    `json:"event"`
	Change          string                    `json:"change"`
	Auction         dto.ResponseAuction       `json:"auction"`
	CurrentPrice    float64                   `json:"current_price"`
	CurrentBidderID *uuid.UUID                `json:"current_bidder_id"`
	Bids            []dto.ResponseBidWithUser `json:"bids"`
}
