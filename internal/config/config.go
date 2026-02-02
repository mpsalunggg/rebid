package config

import (
	"fmt"
	"os"
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
		Port:      getEnv("PORT", "8080"),
		Host:      getEnv("HOST", "localhost"),
		DBHost:    getEnv("DB_HOST", "localhost"),
		DBPort:    getEnv("DB_PORT", "5432"),
		DBUser:    getEnv("DB_USER", "rebid_user"),
		DBPass:    getEnv("DB_PASSWORD", "rebid_password"),
		DBName:    getEnv("DB_NAME", "rebid_db"),
		DBSSLMode: getEnv("DB_SSLMODE", "disable"),
		JWTSecret: getEnv("JWT_SECRET", "your-secret-key-here"),
		JWTExpiry: jwtExpiry,
		UploadDir: getEnv("UPLOAD_DIR", "./uploads"),
		BaseURL:   getEnv("BASE_URL", "http://localhost:8080"),
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseDuration(s string) time.Duration {
	var hours int
	fmt.Sscanf(s, "%d", &hours)
	if hours > 0 {
		return time.Duration(hours)
	}
	return 0
}
