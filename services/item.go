package services

import (
	"fmt"
	"net/http"
	"rebid/config"
	"rebid/dto"
	"rebid/repositories"
	"rebid/utils"
	"strings"

	"github.com/google/uuid"
)

type ItemService struct {
	repo      *repositories.ItemRepository
	imageRepo *repositories.ItemImageRepository
	config    *config.Config
}

func NewItemService(cfg *config.Config) *ItemService {
	return &ItemService{
		repo:      repositories.NewItemRepository(),
		imageRepo: repositories.NewItemImageRepository(),
		config:    cfg,
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

	if len(item.Images) > 0 {
		itemID, err := uuid.Parse(result.ID)
		if err != nil {
			return nil, utils.NewError("failed to parse item ID", http.StatusInternalServerError)
		}

		var createdImages []dto.ItemImageResponse

		for _, imgData := range item.Images {
			createImageReq := &dto.CreateItemImageRequest{
				ItemID:   itemID,
				URL:      imgData.URL,
				Filename: imgData.Filename,
				MimeType: imgData.MimeType,
				Size:     imgData.Size,
			}

			createdImage, err := s.imageRepo.Create(createImageReq)
			if err != nil {
				return nil, utils.NewError("failed to create item image: "+err.Error(), http.StatusInternalServerError)
			}

			baseURL := strings.TrimSuffix(s.config.BaseURL, "/")
			path := strings.TrimPrefix(createdImage.URL, "/")
			createdImage.URL = fmt.Sprintf("%s/%s", baseURL, path)
			createdImages = append(createdImages, *createdImage)
		}

		result.Images = createdImages
	} else {
		result.Images = []dto.ItemImageResponse{}
	}

	return result, nil
}

func (s *ItemService) GetItemByID(itemID string) (*dto.ItemResponse, error) {
	itemUUID, err := uuid.Parse(itemID)
	if err != nil {
		return nil, utils.NewError("invalid item ID format", http.StatusBadRequest)
	}

	result, err := s.repo.GetByID(itemUUID)
	if err != nil {
		if err.Error() == "item not found" {
			return nil, utils.NewError("item not found", http.StatusNotFound)
		}
		return nil, utils.NewError(err.Error(), http.StatusInternalServerError)
	}

	baseURL := strings.TrimSuffix(s.config.BaseURL, "/")
	for i := range result.Images {
		path := strings.TrimPrefix(result.Images[i].URL, "/")
		result.Images[i].URL = fmt.Sprintf("%s/%s", baseURL, path)
	}

	return result, nil
}

func (s *ItemService) UpdateItem(itemID, userID string, req *dto.UpdateItemRequest) (*dto.ItemResponse, error) {
	itemUUID, err := uuid.Parse(itemID)
	if err != nil {
		return nil, utils.NewError("invalid item ID format", http.StatusBadRequest)
	}

	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, utils.NewError("invalid user ID format", http.StatusBadRequest)
	}

	isOwner, err := s.repo.IsOwner(itemUUID, userUUID)
	if err != nil {
		return nil, utils.NewError("failed to verify ownership", http.StatusInternalServerError)
	}
	if !isOwner {
		return nil, utils.NewError("forbidden: you don't own this item", http.StatusForbidden)
	}

	result, err := s.repo.Update(itemUUID, req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return nil, utils.NewError("item not found", http.StatusNotFound)
		}
		return nil, utils.NewError(err.Error(), http.StatusInternalServerError)
	}

	var keepUUIDs []uuid.UUID
	for _, id := range req.KeepImageIDs {
		if parsed, err := uuid.Parse(id); err == nil {
			keepUUIDs = append(keepUUIDs, parsed)
		}
	}

	if err := s.imageRepo.DeleteByItemIDExcept(itemUUID, keepUUIDs); err != nil {
		fmt.Printf("failed to delete old images: %v\n", err)
	}

	for _, imgData := range req.Images {
		createReq := &dto.CreateItemImageRequest{
			ItemID:   itemUUID,
			URL:      imgData.URL,
			Filename: imgData.Filename,
			MimeType: imgData.MimeType,
			Size:     imgData.Size,
		}
		if _, err := s.imageRepo.Create(createReq); err != nil {
			fmt.Printf("warning: failed to create image: %v\n", err)
		}
	}

	images, _ := s.imageRepo.GetByItemID(itemUUID)
	baseURL := strings.TrimSuffix(s.config.BaseURL, "/")
	for i := range images {
		path := strings.TrimPrefix(images[i].URL, "/")
		images[i].URL = fmt.Sprintf("%s/%s", baseURL, path)
	}
	result.Images = images

	return result, nil
}
