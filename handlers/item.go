package handlers

import (
	"fmt"
	"net/http"
	"rebid/dto"
	"rebid/middleware"
	"rebid/utils"
	"strconv"
)

func (h *Handler) CreateItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		utils.JSONResponse(w, http.StatusUnauthorized, utils.ErrorResponse("User not authenticated"))
		return
	}

	err = r.ParseMultipartForm(32 << 20)
	if err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("Failed to parse form data"))
		return
	}

	name := r.FormValue("name")
	description := r.FormValue("description")
	startingPriceStr := r.FormValue("starting_price")

	var startingPrice float64
	if startingPriceStr != "" {
		var err error
		startingPrice, err = strconv.ParseFloat(startingPriceStr, 64)
		if err != nil {
			utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("Invalid starting_price format"))
			return
		}
	}

	request := &dto.CreateItemRequest{
		Name:          name,
		Description:   description,
		StartingPrice: startingPrice,
	}

	if err := request.Validate(); err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse(err.Error()))
		return
	}
	uploadedFiles, err := utils.SaveMultipleUploadedFiles(r, "images", h.cfg.UploadDir)
	if err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse(fmt.Sprintf("Failed to upload images: %v", err)))
		return
	}
	var images []dto.CreateItemImageData
	for _, file := range uploadedFiles {
		images = append(images, dto.CreateItemImageData{
			URL:      file.Path,
			Filename: file.Filename,
			MimeType: file.MimeType,
			Size:     file.Size,
		})
	}

	request.Images = images

	item, err := h.itemService.CreateItem(request, userID.String())
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	utils.JSONResponse(
		w,
		http.StatusCreated,
		utils.SuccessResponse("Item created successfully", item),
	)
}

func (h *Handler) GetItemByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONResponse(w, http.StatusMethodNotAllowed, utils.ErrorResponse("Method not allowed"))
		return
	}

	id := r.PathValue("id")

	if id == "" {
		utils.JSONResponse(w, http.StatusBadRequest, utils.ErrorResponse("ID is required"))
		return
	}

	item, err := h.itemService.GetItemByID(id)
	if err != nil {
		utils.HandleServiceError(w, err)
		return
	}

	utils.JSONResponse(w, http.StatusOK, utils.SuccessResponse("Item retrieved successfully", item))
}
