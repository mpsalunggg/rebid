package pkg

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Error   bool        `json:"error"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func SuccessResponse(message string, data interface{}) Response {
	return Response{
		Error:   false,
		Message: message,
		Data:    data,
	}
}

func ErrorResponse(message string) Response {
	return Response{
		Error:   true,
		Message: message,
	}
}

func JSONResponse(w http.ResponseWriter, status int, response Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}
