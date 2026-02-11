package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/internal/dto"
	"rebid/internal/middleware"
	"rebid/pkg"
)

func (h *Handler) AuctionHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.CreateAuction(w, r)
	default:
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
}

func (h *Handler) AuctionByIDHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPut:
		h.UpdateAuction(w, r)
	default:
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
}

func (h *Handler) CreateAuction(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
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

	auction, err := h.auctionService.CreateAuction(ctx, request, userID.String())
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusCreated, pkg.SuccessResponse("Auction created successfully", auction))
}

func (h *Handler) UpdateAuction(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	auctionID := r.PathValue("id")
	if auctionID == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Auction ID is required"))
		return
	}

	request := &dto.UpdateAuctionRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	auction, err := h.auctionService.UpdateAuction(ctx, request, auctionID)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Auction updated successfully", auction))
}
