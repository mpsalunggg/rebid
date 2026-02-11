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
	Images        []ItemImageResponse `json:"images"`
	CreatedAt     string              `json:"created_at"`
	UpdatedAt     string              `json:"updated_at"`
}

func validateItem(name, description string, isCreate bool) error {
	if isCreate {
		if name == "" {
			return errors.New("name is required")
		}
		if description == "" {
			return errors.New("description is required")
		}
	}

	if name != "" && (len(name) < 3 || len(name) > 255) {
		return errors.New("name must be between 3 and 255 characters")
	}

	if description != "" && len(description) < 10 {
		return errors.New("description must be at least 10 characters")
	}

	return nil
}

func (r *CreateItemRequest) Validate() error {
	return validateItem(r.Name, r.Description, true)
}

func (r *UpdateItemRequest) Validate() error {
	return validateItem(r.Name, r.Description, false)
}
