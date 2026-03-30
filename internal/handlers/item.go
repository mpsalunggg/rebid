package handlers

import (
	"fmt"
	"net/http"
	"rebid/internal/dto"
	"rebid/internal/middleware"
	"rebid/pkg"
)

func (h *Handler) GetAllItems(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	page, limit, err := pkg.ParsePaginationQuery(r.URL.Query())
	if err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	items, err := h.itemService.GetAll(r.Context(), page, limit, userID.String())
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Items retrieved successfully", items))
}
func (h *Handler) GetMyItems(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	userID, _ := middleware.GetUserByID(r)

	items, err := h.itemService.GetMyItems(r.Context(), userID.String())
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Items retrieved successfully", items))
}

func (h *Handler) CreateItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	err = r.ParseMultipartForm(32 << 20)
	if err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Failed to parse form data"))
		return
	}

	name := r.FormValue("name")
	description := r.FormValue("description")

	request := &dto.CreateItemRequest{
		Name:        name,
		Description: description,
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}
	uploadedFiles, err := pkg.SaveMultipleUploadedFiles(r, "images", h.cfg.UploadDir)
	if err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(fmt.Sprintf("Failed to upload images: %v", err)))
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
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(
		w,
		http.StatusCreated,
		pkg.SuccessResponse("Item created successfully", item),
	)
}

func (h *Handler) GetItemByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	id := r.PathValue("id")

	if id == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("ID is required"))
		return
	}

	item, err := h.itemService.GetItemByID(id)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Item retrieved successfully", item))
}

func (h *Handler) UpdateItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPatch {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	itemID := r.PathValue("id")
	if itemID == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Item ID is required"))
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Failed to parse form data"))
		return
	}

	request := &dto.UpdateItemRequest{
		Name:         r.FormValue("name"),
		Description:  r.FormValue("description"),
		KeepImageIDs: r.Form["keep_image_ids"],
	}

	if err := request.Validate(); err != nil {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse(err.Error()))
		return
	}

	uploadedFiles, _ := pkg.SaveMultipleUploadedFiles(r, "images", h.cfg.UploadDir)
	for _, file := range uploadedFiles {
		request.Images = append(request.Images, dto.CreateItemImageData{
			URL:      file.Path,
			Filename: file.Filename,
			MimeType: file.MimeType,
			Size:     file.Size,
		})
	}

	item, err := h.itemService.UpdateItem(itemID, userID.String(), request)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Item updated successfully", item))
}

func (h *Handler) DeleteItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	userID, err := middleware.GetUserByID(r)
	if err != nil {
		pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
		return
	}

	itemID := r.PathValue("id")
	if itemID == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("Item ID is required"))
		return
	}

	if err := h.itemService.DeleteItem(itemID, userID.String()); err != nil {
		pkg.HandleServiceError(w, err)
		return
	}

	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Item deleted successfully", nil))
}
