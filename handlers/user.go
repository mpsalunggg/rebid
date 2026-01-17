package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/config"
	"rebid/dto"
	"rebid/services"
	"rebid/utils"
)

var cfg *config.Config

func InitHandlers(config *config.Config) {
	cfg = config
}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
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

	userService := services.NewUserService(cfg)
	user, err := userService.RegisterUser(request)
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

func LoginUser(w http.ResponseWriter, r *http.Request) {
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

	userService := services.NewUserService(cfg)
	loginResponse, err := userService.LoginUser(request)
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

func GetUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := map[string]interface{}{
		"users": []interface{}{},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
