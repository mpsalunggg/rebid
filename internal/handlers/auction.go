package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/internal/dto"
	"rebid/internal/middleware"
	"rebid/pkg"
)

func (h *Handler) CreateAuction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	request := &dto.CreateAuctionRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	auction, err := h.auctionService.CreateAuction(request, userID.String())
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusCreated, pkg.SuccessResponse("Auction created successfully", auction))
}
