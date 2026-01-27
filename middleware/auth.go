package middleware

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"rebid/config"
	"rebid/utils"
	"strings"

	"github.com/google/uuid"
)

type contextKey string

const (
	UserIDKey contextKey = "userID"
	RoleKey   contextKey = "role"
)

func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("Unauthorized"))
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("Unauthorized"))
				return
			}

			token := parts[1]
			claims, err := utils.ParseToken(token, cfg.JWTSecret)
			if err != nil {
				utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("Unauthorized"))
				return
			}

			userID, err := uuid.Parse(claims.UserID)
			if err != nil {
				utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("Unauthorized"))
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			ctx = context.WithValue(ctx, RoleKey, claims.Role)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func GetUserByID(r *http.Request) (uuid.UUID, error) {
	userID, ok := r.Context().Value(UserIDKey).(uuid.UUID)
	if !ok {
		return uuid.UUID{}, errors.New("user ID not found in context")
	}
	return userID, nil
}
