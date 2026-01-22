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

func (r *CreateItemRequest) Validate() error {
	if r.Name == "" {
		return errors.New("name is required")
	}
	if len(r.Name) < 3 || len(r.Name) > 255 {
		return errors.New("name must be between 3 and 255 characters")
	}
	if r.Description == "" {
		return errors.New("description is required")
	}
	if len(r.Description) < 10 {
		return errors.New("description must be at least 10 characters")
	}
	if r.StartingPrice <= 0 {
		return errors.New("starting price must be greater than 0")
	}
	return nil
}
