package handlers

import (
	"net/http"
	"rebid/pkg"
)

func (h *Handler) CreateAuction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	// userID, err := middleware.GetUserByID(r)
	// if err != nil {
	// 	pkg.JSONResponse(w, http.StatusUnauthorized, pkg.ErrorResponse("User not authenticated"))
	// 	return
	// }

}
