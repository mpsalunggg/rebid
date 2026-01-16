package handlers

import (
	"encoding/json"
	"net/http"
	"rebid/dto"
	"rebid/services"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	request := &dto.CreateUserRequest{}
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userService := services.NewUserService()
	user, err := userService.RegisterUser(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"message": "User registered successfully",
		"data":    user,
	}
	json.NewEncoder(w).Encode(response)
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
