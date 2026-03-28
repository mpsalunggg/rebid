package seeders

import (
	"database/sql"
	"fmt"
	"log"
)

func Seed(db *sql.DB) error {
	log.Println("Starting database seeding...")

	users, err := seedUsers(db)
	if err != nil {
		return fmt.Errorf("failed to seed users: %w", err)
	}
	log.Printf("Seeded %d users", len(users))

	log.Println("🎉 Database seeding completed successfully!")
	return nil
}
