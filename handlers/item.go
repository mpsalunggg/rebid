package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/dto"
	"rebid/middleware"
	"rebid/utils"
)

func (h *Handler) CreateItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("User not authenticated"))
		return
	}

	request := &dto.CreateItemRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse(err.Error()))
		return
	}

	item, err := h.itemService.CreateItem(request, userID.String())
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	utils.JSONResponse(
		w,
		http.StatusCreated,
		utils.SuccessResponse("Item created successfully", item),
	)
}

func (h *Handler) GetItemByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	id := r.PathValue("id")

	if id == "" {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("ID is required"))
		return
	}

	item, err := h.itemService.GetItemByID(id)
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	utils.JSONResponse(w, http.StatusOK, utils.SuccessResponse("Item retrieved successfully", item))
}
