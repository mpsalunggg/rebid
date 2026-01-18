package repositories

import (
	"database/sql"
	"fmt"
	database "rebid/databases"
	"rebid/dto"
	"rebid/models"

	"github.com/google/uuid"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		db: database.GetDB(),
	}
}

func (r *UserRepository) GetByID(id string) (*models.User, error) {
	userUUID, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	var user models.User
	err = r.db.QueryRow(
		"SELECT id, name, email, role, created_at FROM users WHERE id = $1",
		userUUID,
	).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}

	return &user, nil
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.QueryRow(
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
	query := `
		INSERT INTO users (id, name, email, password, role, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
		RETURNING id, name, email, role, created_at
	`

	var response dto.UserResponse
	err := r.db.QueryRow(
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
