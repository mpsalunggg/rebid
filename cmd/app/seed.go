package main

import (
	"fmt"
	"log"
	"rebid/internal/config"
	database "rebid/internal/databases"
	"rebid/internal/databases/seeders"
)

func RunSeed() {
	fmt.Println("Running database seeder...")

	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	db, err := database.Open(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := seeders.Seed(db); err != nil {
		log.Fatal("Failed to seed database:", err)
	}
}
