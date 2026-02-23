package middleware

import (
	"net/http"
	"rebid/internal/config"
)

func CORS(cfg *config.Config) func(http.Handler) http.Handler {
	origin := cfg.FrontendOrigin
	if origin == "" {
		origin = "http://localhost:3000"
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			reqOrigin := r.Header.Get("Origin")
			allowOrigin := ""
			if reqOrigin != "" && (reqOrigin == origin || origin == "*") {
				if cfg.CORSAllowOrigins && origin != "*" {
					allowOrigin = reqOrigin
				} else {
					allowOrigin = origin
				}
			}
			if allowOrigin == "" && origin == "*" {
				allowOrigin = "*"
			}

			w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if cfg.CORSAllowOrigins {
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}
			w.Header().Set("Access-Control-Max-Age", "86400")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
