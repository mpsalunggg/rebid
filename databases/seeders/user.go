package seeders

import (
	"database/sql"
	"fmt"
	"time"

	database "rebid/databases"
	"rebid/models"
	"rebid/utils"

	"github.com/google/uuid"
)

func seedUsers() ([]models.User, error) {
	db := database.GetDB()
	users := []models.User{}

	userData := []struct {
		name     string
		email    string
		password string
		role     models.UserRole
	}{
		{"Admin", "admin@rebid.com", "admin123", models.RoleAdmin},
		{"User", "john@example.com", "password123", models.RoleUser},
	}

	for _, u := range userData {
		hashedPassword, err := utils.HashPassword(u.password)
		if err != nil {
			return nil, fmt.Errorf("failed to hash password: %w", err)
		}

		user := models.User{
			ID:        uuid.New(),
			Name:      u.name,
			Email:     u.email,
			Password:  hashedPassword,
			Role:      u.role,
			CreatedAt: time.Now(),
		}

		query := `
			INSERT INTO users (id, name, email, password, role, created_at)
			VALUES ($1, $2, $3, $4, $5, $6)
			ON CONFLICT (email) DO NOTHING
		`
		_, err = db.Exec(query, user.ID, user.Name, user.Email, user.Password, user.Role, user.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to insert user %s: %w", u.email, err)
		}

		var insertedUser models.User
		err = db.QueryRow(
			"SELECT id, name, email, password, role, created_at FROM users WHERE email = $1",
			u.email,
		).Scan(&insertedUser.ID, &insertedUser.Name, &insertedUser.Email, &insertedUser.Password, &insertedUser.Role, &insertedUser.CreatedAt)

		if err != nil && err != sql.ErrNoRows {
			return nil, fmt.Errorf("failed to get inserted user: %w", err)
		}

		if err == nil {
			users = append(users, insertedUser)
		}
	}

	return users, nil
}
