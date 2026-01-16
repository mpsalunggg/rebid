package services

import (
	"net/http"
	"rebid/dto"
	"rebid/models"
	"rebid/repositories"
	"rebid/utils"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		repo: repositories.NewUserRepository(),
	}
}

func (s *UserService) RegisterUser(user *dto.CreateUserRequest) (*dto.UserResponse, error) {
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return nil, utils.NewError("failed to hash password", http.StatusInternalServerError)
	}

	existingUser, err := s.repo.GetByEmail(user.Email)
	if err != nil {
		return nil, utils.NewError("failed to check email", http.StatusInternalServerError)
	}
	if existingUser != nil {
		return nil, utils.NewError("email already exists", http.StatusBadRequest)
	}

	user.Password = hashedPassword
	result, err := s.repo.Create(user)
	if err != nil {
		return nil, utils.NewError("failed to create user", http.StatusInternalServerError)
	}

	return result, nil
}

func (s *UserService) GetUserByID(id string) (*models.User, error) {
	return s.repo.GetByID(id)
}
