package dto

import (
	"errors"
	"rebid/internal/models"
	"strings"
	"time"

	"github.com/google/uuid"
)

type CreateAuctionRequest struct {
	ItemID        uuid.UUID `json:"item_id"`
	StartingPrice float64   `json:"starting_price"`
	StartTime     time.Time `json:"start_time"`
	EndTime       time.Time `json:"end_time"`
	Status        string    `json:"status"`
}

type UpdateAuctionRequest struct {
	StartingPrice float64   `json:"starting_price"`
	StartTime     time.Time `json:"start_time"`
	EndTime       time.Time `json:"end_time"`
	Status        *string   `json:"status"`
}

type ResponseAuction struct {
	ID              uuid.UUID  `json:"id"`
	CreatedBy       uuid.UUID  `json:"created_by"`
	ItemID          uuid.UUID  `json:"item_id"`
	StartingPrice   float64    `json:"starting_price"`
	CurrentPrice    float64    `json:"current_price"`
	StartTime       time.Time  `json:"start_time"`
	EndTime         time.Time  `json:"end_time"`
	CurrentBidderID *uuid.UUID `json:"current_bidder_id" db:"current_bidder_id"`
	Status          string     `json:"status"`
	CreatedAt       string     `json:"created_at"`
	UpdatedAt       string     `json:"updated_at"`
}

type ResponseCurrentPrice struct {
	Amount float64 `json:"amount"`
}

type FilterAuction struct {
	Limit         int        `json:"limit"`
	Status        *string    `json:"status"`
	StartTime     *time.Time `json:"start_time"`
	EndTime       *time.Time `json:"end_time"`
	StartingPrice *float64   `json:"starting_price"`
}

func IsValidAuctionStatus(status string) bool {
	switch status {
	case string(models.AuctionScheduled),
		string(models.AuctionActive),
		string(models.AuctionEnded),
		string(models.AuctionCancelled):
		return true
	default:
		return false
	}
}

var validStatuses = []string{
	string(models.AuctionScheduled),
	string(models.AuctionActive),
	string(models.AuctionEnded),
	string(models.AuctionCancelled),
}

func (r *CreateAuctionRequest) Validate() error {
	if r.ItemID == uuid.Nil {
		return errors.New("item ID is required")
	}
	if r.StartingPrice <= 0 {
		return errors.New("starting price must be greater than 0")
	}
	if r.StartTime.IsZero() {
		return errors.New("start time is required")
	}
	if r.EndTime.IsZero() {
		return errors.New("end time is required")
	}
	if !IsValidAuctionStatus(r.Status) {
		return errors.New("status is invalid, must be one of: " + strings.Join(validStatuses, ", "))
	}

	return nil
}

func (r *UpdateAuctionRequest) Validate() error {
	if r.StartTime.IsZero() {
		return errors.New("start time is required")
	}
	if r.EndTime.IsZero() {
		return errors.New("end time is required")
	}
	if r.Status != nil && !IsValidAuctionStatus(*r.Status) {
		return errors.New("status is invalid, must be one of: " + strings.Join(validStatuses, ", "))
	}
	return nil
}
