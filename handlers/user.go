package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/dto"
	"rebid/middleware"
	"rebid/utils"

	"github.com/google/uuid"
)

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	request := &dto.CreateUserRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse(err.Error()))
		return
	}

	if h.userService == nil {
		utils.JSONResponse(w, http.StatusInternalServerError, utils.ErrorResponse("Service not initialized"))
		return
	}

	user, err := h.userService.RegisterUser(request)
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	utils.JSONResponse(
		w,
		http.StatusCreated,
		utils.SuccessResponse("User registered successfully", user),
	)
}

func (h *Handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	request := &dto.LoginRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse(err.Error()))
		return
	}

	if h.userService == nil {
		utils.JSONResponse(w, http.StatusInternalServerError, utils.ErrorResponse("Service not initialized"))
		return
	}

	loginResponse, err := h.userService.LoginUser(request)
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	utils.JSONResponse(
		w,
		http.StatusOK,
		utils.SuccessResponse("Login success", loginResponse),
	)
}

func (h *Handler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	if h.userService == nil {
		utils.JSONResponse(w, http.StatusInternalServerError, utils.ErrorResponse("Service not initialized"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("User not authenticated"))
		return
	}

	user, err := h.userService.GetUserByID(userID.String())
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	if user == nil {
		utils.JSONResponse(w, http.StatusNotFound, utils.ErrorResponse("User not found"))
		return
	}

	if user.ID == (uuid.UUID{}) {
		utils.JSONResponse(w, http.StatusInternalServerError, utils.ErrorResponse("Invalid user data"))
		return
	}

	response := dto.UserResponse{
		ID:        user.ID.String(),
		Name:      user.Name,
		Email:     user.Email,
		Role:      string(user.Role),
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	utils.JSONResponse(w, http.StatusOK, utils.SuccessResponse("User retrieved successfully", response))
}
