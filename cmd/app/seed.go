package main

import (
	"fmt"
	"log"
	"rebid/config"
	database "rebid/databases"
	"rebid/databases/seeders"
)

func RunSeed() {
	fmt.Println("Running database seeder...")

	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	err = database.InitDB(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.CloseDB()

	if err := seeders.Seed(); err != nil {
		log.Fatal("Failed to seed database:", err)
	}
}
