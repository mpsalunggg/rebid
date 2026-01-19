package dto

import (
	"errors"
)

type CreateItemRequest struct {
	Name          string  `json:"name"`
	Description   string  `json:"description"`
	Image         string  `json:"image"`
	StartingPrice float64 `json:"starting_price"`
}

type ItemResponse struct {
	ID            string  `json:"id"`
	UserID        string  `json:"user_id"`
	Name          string  `json:"name"`
	Description   string  `json:"description"`
	Image         string  `json:"image"`
	StartingPrice float64 `json:"starting_price"`
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
}

func (r *CreateItemRequest) Validate() error {
	if r.Name == "" {
		return errors.New("name is required")
	}
	if r.Description == "" {
		return errors.New("description is required")
	}
	if r.StartingPrice <= 0 {
		return errors.New("starting price must be greater than 0")
	}
	return nil
}
