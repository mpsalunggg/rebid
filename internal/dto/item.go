package dto

import (
	"errors"
)

type CreateItemImageData struct {
	URL      string `json:"url"`
	Filename string `json:"filename"`
	MimeType string `json:"mime_type"`
	Size     int64  `json:"size"`
}

type CreateItemRequest struct {
	Name          string                `form:"name" json:"name"`
	Description   string                `form:"description" json:"description"`
	StartingPrice float64               `form:"starting_price" json:"starting_price"`
	Images        []CreateItemImageData `json:"images,omitempty"`
}

type UpdateItemRequest struct {
	Name          string                `form:"name" json:"name"`
	Description   string                `form:"description" json:"description"`
	StartingPrice float64               `form:"starting_price" json:"starting_price"`
	KeepImageIDs  []string              `form:"keep_image_ids" json:"keep_image_ids"`
	Images        []CreateItemImageData `json:"images,omitempty"`
}

type ItemResponse struct {
	ID            string              `json:"id"`
	UserID        string              `json:"user_id"`
	Name          string              `json:"name"`
	Description   string              `json:"description"`
	StartingPrice float64             `json:"starting_price"`
	Images        []ItemImageResponse `json:"images"`
	CreatedAt     string              `json:"created_at"`
	UpdatedAt     string              `json:"updated_at"`
}

func validateItem(name, description string, startingPrice float64, isCreate bool) error {
	if isCreate {
		if name == "" {
			return errors.New("name is required")
		}
		if description == "" {
			return errors.New("description is required")
		}
		if startingPrice <= 0 {
			return errors.New("starting price must be greater than 0")
		}
	}

	if name != "" && (len(name) < 3 || len(name) > 255) {
		return errors.New("name must be between 3 and 255 characters")
	}

	if description != "" && len(description) < 10 {
		return errors.New("description must be at least 10 characters")
	}

	if startingPrice < 0 {
		return errors.New("starting price cannot be negative")
	}

	return nil
}

func (r *CreateItemRequest) Validate() error {
	return validateItem(r.Name, r.Description, r.StartingPrice, true)
}

func (r *UpdateItemRequest) Validate() error {
	return validateItem(r.Name, r.Description, r.StartingPrice, false)
}
