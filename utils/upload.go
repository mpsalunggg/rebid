package utils

import (
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

const (
	MaxUploadSize    = 10 << 20
	AllowedMimeTypes = "image/jpeg,image/jpg,image/png,image/gif,image/webp"
)

type UploadedFile struct {
	Filename string
	Path     string
	MimeType string
	Size     int64
}

func SaveMultipleUploadedFiles(r *http.Request, formKey string, uploadDir string) ([]*UploadedFile, error) {
	if r.MultipartForm == nil {
		err := r.ParseMultipartForm(MaxUploadSize)
		if err != nil {
			return nil, fmt.Errorf("failed to parse multipart form: %w", err)
		}
	}

	files := r.MultipartForm.File[formKey]
	if len(files) == 0 {
		return []*UploadedFile{}, nil
	}

	var uploadedFiles []*UploadedFile

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file: %w", err)
		}

		if fileHeader.Size > MaxUploadSize {
			file.Close()
			return nil, fmt.Errorf("file %s size exceeds maximum allowed size (10MB)", fileHeader.Filename)
		}

		mimeType := fileHeader.Header.Get("Content-Type")
		if mimeType == "" {
			// Try to detect from extension
			mimeType = mime.TypeByExtension(filepath.Ext(fileHeader.Filename))
		}
		if !isValidImageMimeType(mimeType) {
			file.Close()
			return nil, fmt.Errorf("invalid file type for %s: %s", fileHeader.Filename, mimeType)
		}

		ext := filepath.Ext(fileHeader.Filename)
		newFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)

		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			file.Close()
			return nil, fmt.Errorf("failed to create upload directory: %w", err)
		}

		filePath := filepath.Join(uploadDir, newFilename)

		dst, err := os.Create(filePath)
		if err != nil {
			file.Close()
			return nil, fmt.Errorf("failed to create file: %w", err)
		}

		_, err = io.Copy(dst, file)
		file.Close()
		dst.Close()

		if err != nil {
			return nil, fmt.Errorf("failed to save file: %w", err)
		}

		relativePath := filepath.Join("uploads", newFilename)
		relativePath = strings.ReplaceAll(relativePath, "\\", "/")

		uploadedFiles = append(uploadedFiles, &UploadedFile{
			Filename: fileHeader.Filename,
			Path:     relativePath,
			MimeType: mimeType,
			Size:     fileHeader.Size,
		})
	}

	return uploadedFiles, nil
}

func isValidImageMimeType(mimeType string) bool {
	validTypes := []string{
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
	}
	mimeType = strings.ToLower(mimeType)
	for _, validType := range validTypes {
		if mimeType == validType {
			return true
		}
	}
	return false
}

func DeleteFile(filePath string) error {
	path := strings.TrimPrefix(filePath, "/")

	if err := os.Remove(path); err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("failed to delete file %s: %w", path, err)
	}
	return nil
}
