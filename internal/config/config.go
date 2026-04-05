package config

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port      string
	Host      string
	DBHost    string
	DBPort    string
	DBUser    string
	DBPass    string
	DBName    string
	DBSSLMode string
	JWTSecret string
	JWTExpiry time.Duration
	UploadDir string
	BaseURL   string
	// token cookie
	CookieName           string
	CookieSecure         bool
	CookieSameSite       string
	FrontendOrigins      []string
	CORSAllowCredentials bool
	// oauth google
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURI  string
	// worker
	AuctionCloserCron string
}

func (c *Config) DBConnectionString() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPass, c.DBName, c.DBSSLMode,
	)
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	jwtExpiryStr := getEnv("JWT_EXPIRY_HOURS", "24")
	jwtExpiry := 24 * time.Hour
	if expiryHours := parseDuration(jwtExpiryStr); expiryHours > 0 {
		jwtExpiry = expiryHours * time.Hour
	}

	config := &Config{
		Port:                 getEnv("PORT", "8080"),
		Host:                 getEnv("HOST", "localhost"),
		DBHost:               getEnv("DB_HOST", "localhost"),
		DBPort:               getEnv("DB_PORT", "5432"),
		DBUser:               getEnv("DB_USER", "rebid_user"),
		DBPass:               getEnv("DB_PASSWORD", "rebid_password"),
		DBName:               getEnv("DB_NAME", "rebid_db"),
		DBSSLMode:            getEnv("DB_SSLMODE", "disable"),
		JWTSecret:            getEnv("JWT_SECRET", "your-secret-key-here"),
		JWTExpiry:            jwtExpiry,
		UploadDir:            getEnv("UPLOAD_DIR", "./uploads"),
		BaseURL:              getEnv("BASE_URL", "http://localhost:8080"),
		CookieName:           getEnv("COOKIE_NAME", "token"),
		CookieSecure:         getEnv("COOKIE_SECURE", "false") == "true",
		CookieSameSite:       getEnv("COOKIE_SAME_SITE", "lax"),
		FrontendOrigins:      parseFrontendOrigins(getEnv("FRONTEND_ORIGINS", "http://localhost:3000")),
		CORSAllowCredentials: getEnv("CORS_ALLOW_CREDENTIALS", "true") == "true",
		GoogleClientID:       getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret:   getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURI:    getEnv("GOOGLE_REDIRECT_URI", "http://localhost:8080/api/v1/auth/google/callback"),
		AuctionCloserCron:    getEnv("AUCTION_CLOSER_CRON", "0 * * * * *"),
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseFrontendOrigins(raw string) []string {
	seen := make(map[string]bool)
	var out []string

	add := func(origin string) {
		origin = strings.TrimSpace(origin)
		if origin == "" || seen[origin] {
			return
		}
		seen[origin] = true
		out = append(out, origin)

		switch {
		case strings.HasPrefix(origin, "http://localhost:"):
			port := strings.TrimPrefix(origin, "http://localhost:")
			other := "http://127.0.0.1:" + port
			if !seen[other] {
				seen[other] = true
				out = append(out, other)
			}
		case strings.HasPrefix(origin, "http://127.0.0.1:"):
			port := strings.TrimPrefix(origin, "http://127.0.0.1:")
			other := "http://localhost:" + port
			if !seen[other] {
				seen[other] = true
				out = append(out, other)
			}
		}
	}

	for _, part := range strings.Split(raw, ",") {
		add(part)
	}
	return out
}

func parseDuration(s string) time.Duration {
	var hours int
	fmt.Sscanf(s, "%d", &hours)
	if hours > 0 {
		return time.Duration(hours)
	}
	return 0
}
