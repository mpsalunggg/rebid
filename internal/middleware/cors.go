package middleware

import (
	"net/http"
	"rebid/internal/config"
)

func CORS(cfg *config.Config) func(http.Handler) http.Handler {
	allowed := cfg.FrontendOrigins
	if len(allowed) == 0 {
		allowed = []string{"http://localhost:3000", "http://127.0.0.1:3000"}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			reqOrigin := r.Header.Get("Origin")

			allowWildcard := false
			allowOrigin := ""
			for _, o := range allowed {
				if o == "*" {
					allowWildcard = true
					break
				}
				if reqOrigin == o {
					allowOrigin = reqOrigin
					break
				}
			}

			if allowWildcard {
				w.Header().Set("Access-Control-Allow-Origin", "*")
			} else if allowOrigin != "" {
				w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
			}

			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Max-Age", "86400")

			if cfg.CORSAllowCredentials {
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
