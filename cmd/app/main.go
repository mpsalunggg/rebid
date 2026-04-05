package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"rebid/internal/bootstrap"
	"rebid/internal/config"
	database "rebid/internal/databases"
	"rebid/internal/routes"
	"rebid/internal/worker"
	"syscall"
	"time"
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

	deps := bootstrap.BuildDependencies(cfg, db)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	worker.StartAuctionCloser(ctx, cfg.AuctionCloserCron, deps.AuctionService, deps.Hub)

	router := routes.SetupRoutes(cfg, deps)

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	srv := &http.Server{
		Addr:    addr,
		Handler: router.Handler(),
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-quit
		log.Println("Shutdown signal received, stopping worker and server...")
		cancel() 

		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownCancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Printf("HTTP server shutdown error: %v", err)
		}
	}()

	fmt.Printf("Server starting on http://%s\n", addr)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("Failed to start server:", err)
	}

	log.Println("Server stopped.")
}
