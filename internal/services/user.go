package services

import (
	"net/http"
	"rebid/internal/config"
	"rebid/internal/dto"
	"rebid/internal/models"
	"rebid/internal/repositories"
	"rebid/pkg"
)

type UserService struct {
	repo   *repositories.UserRepository
	config *config.Config
}

func NewUserService(cfg *config.Config) *UserService {
	return &UserService{
		repo:   repositories.NewUserRepository(),
		config: cfg,
	}
}

func (s *UserService) RegisterUser(user *dto.CreateUserRequest) (*dto.UserResponse, error) {
	hashedPassword, err := pkg.HashPassword(user.Password)
	if err != nil {
		return nil, pkg.NewError("failed to hash password", http.StatusInternalServerError)
	}

	existingUser, err := s.repo.GetByEmail(user.Email)
	if err != nil {
		return nil, pkg.NewError("failed to check email", http.StatusInternalServerError)
	}
	if existingUser != nil {
		return nil, pkg.NewError("email already exists", http.StatusBadRequest)
	}

	user.Password = hashedPassword
	result, err := s.repo.Create(user)
	if err != nil {
		return nil, pkg.NewError("failed to create user", http.StatusInternalServerError)
	}

	return result, nil
}

func (s *UserService) LoginUser(user *dto.LoginRequest) (*dto.LoginResponse, error) {
	existingUser, err := s.repo.GetByEmail(user.Email)
	if err != nil {
		return nil, pkg.NewError("failed to get user by email", http.StatusInternalServerError)
	}
	if existingUser == nil {
		return nil, pkg.NewError("user not found", http.StatusNotFound)
	}

	if !pkg.ComparePassword(existingUser.Password, user.Password) {
		return nil, pkg.NewError("invalid password", http.StatusUnauthorized)
	}

	token, err := pkg.GenerateToken(
		existingUser.ID,
		string(existingUser.Role),
		s.config.JWTSecret,
		s.config.JWTExpiry,
	)

	if err != nil {
		return nil, pkg.NewError("failed to generate token", http.StatusInternalServerError)
	}

	response := &dto.LoginResponse{
		Token: token,
		User: dto.UserResponse{
			ID:        existingUser.ID.String(),
			Name:      existingUser.Name,
			Email:     existingUser.Email,
			Role:      string(existingUser.Role),
			CreatedAt: existingUser.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		},
	}
	return response, nil
}

func (s *UserService) GetUserByID(id string) (*models.User, error) {
	return s.repo.GetByID(id)
}
