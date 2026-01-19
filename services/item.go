package services

import (
	"net/http"
	"rebid/config"
	"rebid/dto"
	"rebid/repositories"
	"rebid/utils"

	"github.com/google/uuid"
)

type ItemService struct {
	repo   *repositories.ItemRepository
	config *config.Config
}

func NewItemService(cfg *config.Config) *ItemService {
	return &ItemService{
		repo:   repositories.NewItemRepository(),
		config: cfg,
	}
}

func (s *ItemService) CreateItem(item *dto.CreateItemRequest, userID string) (*dto.ItemResponse, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, utils.NewError("invalid user ID format", http.StatusBadRequest)
	}

	result, err := s.repo.Create(item, userUUID)
	if err != nil {
		return nil, utils.NewError(err.Error(), http.StatusInternalServerError)
	}

	return result, nil
}
