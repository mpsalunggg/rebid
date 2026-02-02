package middleware

import (
	"context"
	"errors"
	"net/http"
	"rebid/internal/config"
	"rebid/pkg"
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
				pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("Unauthorized, no token provided"))
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("Unauthorized, invalid token format"))
				return
			}

			token := parts[1]
			claims, err := pkg.ParseToken(token, cfg.JWTSecret)
			if err != nil {
				pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("Unauthorized, invalid token"))
				return
			}

			userID, err := uuid.Parse(claims.UserID)
			if err != nil {
				pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("Unauthorized, invalid user ID"))
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
