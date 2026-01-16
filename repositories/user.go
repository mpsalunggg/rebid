package repositories

import (
	"rebid/databases"
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

func (r *UserRepository) Create(user *models.User) error {
	return nil
}
