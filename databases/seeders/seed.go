package seeders

import (
	"fmt"
	"log"
)

func Seed() error {
	log.Println("Starting database seeding...")

	users, err := seedUsers()
	if err != nil {
		return fmt.Errorf("failed to seed users: %w", err)
	}
	log.Printf("Seeded %d users", len(users))

	log.Println("🎉 Database seeding completed successfully!")
	return nil
}
