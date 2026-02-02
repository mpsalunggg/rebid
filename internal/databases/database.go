package database

import (
	"database/sql"
	"fmt"
	"log"

	"rebid/internal/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB(cfg *config.Config) error {
	var err error

	DB, err = sql.Open("postgres", cfg.DBConnectionString())
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Database connected successfully!")
	return nil
}

func CloseDB() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

func GetDB() *sql.DB {
	return DB
}
