package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/internal/dto"
	"rebid/internal/middleware"
	"rebid/pkg"
	"strconv"
	"time"
)

func (h *Handler) AuctionHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetAllAuctions(w, r)
	case http.MethodPost:
		h.CreateAuction(w, r)
	default:
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
}

func (h *Handler) AuctionByIDHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetAuctionByID(w, r)
	case http.MethodPut:
		h.UpdateAuction(w, r)
	case http.MethodDelete:
		h.DeleteAuction(w, r)
	default:
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
}

func (h *Handler) GetAllAuctions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := r.URL.Query()

	filter := &dto.FilterAuction{}

	// limit
	if limit := query.Get("limit"); limit != "" {
		l, err := strconv.Atoi(limit)
		if err != nil {
			pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("invalid limit"))
			return
		}
		filter.Limit = l
	}

	// status
	if status := query.Get("status"); status != "" {
		filter.Status = &status
	}

	// starting price
	if sp := query.Get("starting_price"); sp != "" {
		price, err := strconv.ParseFloat(sp, 64)
		if err != nil {
			pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("invalid starting_price"))
			return
		}
		filter.StartingPrice = &price
	}

	// start_time
	if st := query.Get("start_time"); st != "" {
		t, err := time.Parse(time.RFC3339, st)
		if err != nil {
			pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("invalid start_time"))
			return
		}
		filter.StartTime = &t
	}

	// end_time
	if et := query.Get("end_time"); et != "" {
		t, err := time.Parse(time.RFC3339, et)
		if err != nil {
			pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("invalid end_time"))
			return
		}
		filter.EndTime = &t
	}

	auctions, err := h.auctionService.GetAllAuctions(ctx, filter)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Auctions retrieved successfully", auctions))
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

func (h *Handler) GetAuctionByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	auctionID := r.PathValue("id")
	if auctionID == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Auction ID is required"))
		return
	}

	auction, err := h.auctionService.GetAuctionByID(ctx, auctionID)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Auction retrieved successfully", auction))
}

func (h *Handler) DeleteAuction(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	auctionID := r.PathValue("id")
	if auctionID == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Auction ID is required"))
		return
	}

	if err := h.auctionService.DeleteAuction(ctx, auctionID); err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Auction deleted successfully", nil))

}
