package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/internal/dto"
	"rebid/internal/middleware"
	"rebid/pkg"

	"github.com/google/uuid"
)

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	request := &dto.CreateUserRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	if h.userService == nil {
		pkg.JSONResponse(w, http.StatusInternalServerError, pkg.ErrorResponse("Service not initialized"))
		return
	}

	user, err := h.userService.RegisterUser(request)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(
		w,
		http.StatusCreated,
		pkg.SuccessResponse("User registered successfully", user),
	)
}

func (h *Handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	request := &dto.LoginRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Invalid request body"))
		return
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	if h.userService == nil {
		pkg.JSONResponse(w, http.StatusInternalServerError, pkg.ErrorResponse("Service not initialized"))
		return
	}

	loginResponse, err := h.userService.LoginUser(request)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(
		w,
		http.StatusOK,
		pkg.SuccessResponse("Login success", loginResponse),
	)
}

func (h *Handler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	if h.userService == nil {
		pkg.JSONResponse(w, http.StatusInternalServerError, pkg.ErrorResponse("Service not initialized"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	user, err := h.userService.GetUserByID(userID.String())
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	if user == nil {
		pkg.JSONResponse(w, http.StatusNotFound, pkg.ErrorResponse("User not found"))
		return
	}

	if user.ID == (uuid.UUID{}) {
		pkg.JSONResponse(w, http.StatusInternalServerError, pkg.ErrorResponse("Invalid user data"))
		return
	}

	response := dto.UserResponse{
		ID:        user.ID.String(),
		Name:      user.Name,
		Email:     user.Email,
		Role:      string(user.Role),
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("User retrieved successfully", response))
}
