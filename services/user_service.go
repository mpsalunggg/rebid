package services

import (
	"fmt"
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
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}
	user.Password = hashedPassword
	return s.repo.Create(user)
}

func (s *UserService) GetUserByID(id string) (*models.User, error) {
	return s.repo.GetByID(id)
}
