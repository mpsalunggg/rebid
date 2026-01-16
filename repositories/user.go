package repositories

import (
	"database/sql"
	"errors"
	"fmt"
	database "rebid/databases"
	"rebid/dto"
	"rebid/models"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) GetByID(id string) (*models.User, error) {
	_ = database.GetDB()
	return nil, nil
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	db := database.GetDB()
	var user models.User

	err := db.QueryRow(
		"SELECT id, name, email, password, role, created_at FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role, &user.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return &user, nil
}

func (r *UserRepository) Create(user *dto.CreateUserRequest) (*dto.UserResponse, error) {
	db := database.GetDB()

	existing, err := r.GetByEmail(user.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check email: %w", err)
	}
	if existing != nil {
		return nil, errors.New("email already exists")
	}

	query := `
		INSERT INTO users (id, name, email, password, role, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
		RETURNING id, name, email, role, created_at
	`

	var response dto.UserResponse
	err = db.QueryRow(
		query,
		user.Name,
		user.Email,
		user.Password,
		models.RoleUser,
	).Scan(&response.ID, &response.Name, &response.Email, &response.Role, &response.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &response, nil
}
