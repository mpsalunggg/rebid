package main

import (
	"fmt"
	"log"
	"rebid/config"
	database "rebid/databases"
	"rebid/routes"
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

	err = database.InitDB(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.CloseDB()

	router := routes.SetupRoutes(cfg)

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	fmt.Printf("Server starting on http://%s\n", addr)

	if err := router.Listen(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
