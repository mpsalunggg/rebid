package utils

import "net/http"

type AppError struct {
	Message    string
	StatusCode int
}

func (e *AppError) Error() string {
	return e.Message
}

func NewError(message string, statusCode int) *AppError {
	return &AppError{
		Message:    message,
		StatusCode: statusCode,
	}
}

func HandleServiceError(w http.ResponseWriter, err error) {
	if appErr, ok := err.(*AppError); ok {
		JSONResponse(w, appErr.StatusCode, ErrorResponse(appErr.Message))
	} else {
		JSONResponse(w, http.StatusInternalServerError, ErrorResponse(err.Error()))
	}
}
