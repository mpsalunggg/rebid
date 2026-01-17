package main

import (
	"fmt"
	"log"
	"os"
	"rebid/config"
	database "rebid/databases"
	"rebid/handlers"
	"rebid/routes"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "seed" {
		RunSeed()
		return
	}

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

	handlers.InitHandlers(cfg)
	router := routes.SetupRoutes()

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	fmt.Printf("Server starting on http://%s\n", addr)

	if err := router.Listen(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
