package main

import (
	"fmt"
	"log"
	"rebid/internal/config"
	database "rebid/internal/databases"
	"rebid/internal/routes"
)

func main() {
	RunServer()
}

func RunServer() {
	fmt.Println("Rebid Application Starting...")

	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	db, err := database.Open(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	router := routes.SetupRoutes(cfg, db)

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	fmt.Printf("Server starting on http://%s\n", addr)

	if err := router.Listen(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
