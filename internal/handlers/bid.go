package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/internal/dto"
	"rebid/internal/middleware"
	"rebid/internal/websocket"
	"rebid/pkg"
)

func (h *Handler) BidHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.CreateBid(w, r)
	default:
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
}

func (h *Handler) CreateBid(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	request := &dto.CreateBidRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	bid, err := h.bidService.CreateBid(ctx, request, userID)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	var auctionID string = bid.AuctionID.String()
	auction, err := h.auctionService.GetAuctionByID(ctx, auctionID)
	if err != nil {
		pkg.JSONResponse(w, http.StatusInternalServerError, pkg.ErrorResponse("Failed to get auction"))
		return
	}

	if h.wsHub != nil {
		newBidPayload := websocket.NewBidPayload{
			Event: "new_bid",
			Bid:   *bid,
		}

		b, _ := json.Marshal(newBidPayload)
		h.wsHub.BroadcastToAuction(bid.AuctionID, b)

		subPayload := websocket.SubscribedPayload{
			Event:           "subscribed",
			Auction:         *auction,
			CurrentPrice:    auction.CurrentPrice,
			CurrentBidderID: auction.CurrentBidderID,
		}

		b2, _ := json.Marshal(subPayload)
		h.wsHub.BroadcastToAuction(bid.AuctionID, b2)
	}

	pkg.JSONResponse(w, http.StatusCreated, pkg.SuccessResponse("Bid created successfully", bid))
}
