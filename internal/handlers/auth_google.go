package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"rebid/internal/dto"
	"rebid/pkg"
	"time"
)

func (h *Handler) GoogleAuthRedirect(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}

	state := pkg.GenerateState()
	url := fmt.Sprintf(
		"https://accounts.google.com/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s&access_type=offline&prompt=consent",
		h.cfg.GoogleClientID,
		url.QueryEscape(h.cfg.GoogleRedirectURI),
		url.QueryEscape("openid email profile"),
		state,
	)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *Handler) GoogleAuthCallback(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	if code == "" || state == "" {
		http.Redirect(w, r, h.cfg.FrontendOrigins[0]+"/login?error=missing_code", http.StatusTemporaryRedirect)
		return
	}

	tokenResp, err := pkg.ExchangeGoogleCode(h.cfg.GoogleClientID, h.cfg.GoogleClientSecret, h.cfg.GoogleRedirectURI, code)
	if err != nil {
		http.Redirect(w, r, h.cfg.FrontendOrigins[0]+"/login?error=exchange_failed", http.StatusTemporaryRedirect)
		return
	}

	userInfo, err := pkg.GetGoogleUserInfo(tokenResp.AccessToken)
	if err != nil {
		http.Redirect(w, r, h.cfg.FrontendOrigins[0]+"/login?error=userinfo_failed", http.StatusTemporaryRedirect)
		return
	}

	loginResponse, err := h.userService.LoginOrRegisterWithGoogle(userInfo.Email, userInfo.Name)
	if err != nil {
		http.Redirect(w, r, h.cfg.FrontendOrigins[0]+"/login?error=login_failed", http.StatusTemporaryRedirect)
		return
	}

	var sameSite http.SameSite
	switch h.cfg.CookieSameSite {
	case "lax":
		sameSite = http.SameSiteLaxMode
	case "none":
		sameSite = http.SameSiteNoneMode
	default:
		sameSite = http.SameSiteStrictMode
	}

	cookie := &http.Cookie{
		Name:     h.cfg.CookieName,
		Value:    loginResponse.Token,
		Path:     "/",
		MaxAge:   int(h.cfg.JWTExpiry.Seconds()),
		Expires:  time.Now().Add(h.cfg.JWTExpiry),
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: sameSite,
	}

	http.SetCookie(w, cookie)
	log.Println("Login success", userInfo)
	http.Redirect(w, r, h.cfg.FrontendOrigins[0]+"/", http.StatusTemporaryRedirect)
}

func (h *Handler) GoogleOneTapLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		pkg.JSONResponse(w, http.StatusMethodNotAllowed, pkg.ErrorResponse("Method not allowed"))
		return
	}
	req := &dto.GoogleOneTapRequest{}
	if err := json.NewDecoder(r.Body).Decode(req); err != nil || req.Credential == "" {
		pkg.JSONResponse(w, http.StatusBadRequest, pkg.ErrorResponse("credential is required"))
		return
	}
	userInfo, err := pkg.VerifyGoogleIDToken(req.Credential, h.cfg.GoogleClientID)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}
	loginResponse, err := h.userService.LoginOrRegisterWithGoogle(userInfo.Email, userInfo.Name)
	if err != nil {
		pkg.HandleServiceError(w, err)
		return
	}
	var sameSite http.SameSite
	switch h.cfg.CookieSameSite {
	case "lax":
		sameSite = http.SameSiteLaxMode
	case "none":
		sameSite = http.SameSiteNoneMode
	default:
		sameSite = http.SameSiteStrictMode
	}
	cookie := &http.Cookie{
		Name:     h.cfg.CookieName,
		Value:    loginResponse.Token,
		Path:     "/",
		MaxAge:   int(h.cfg.JWTExpiry.Seconds()),
		Expires:  time.Now().Add(h.cfg.JWTExpiry),
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: sameSite,
	}
	http.SetCookie(w, cookie)
	pkg.JSONResponse(w, http.StatusOK, pkg.SuccessResponse("Login success", loginResponse))
}
