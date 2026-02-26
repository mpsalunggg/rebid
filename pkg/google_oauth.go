package pkg

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/url"
)

type googleTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}

type googleUserInfo struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func GenerateState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func ExchangeGoogleCode(clientID, clientSecret, redirectURI, code string) (*googleTokenResponse, error) {
	body := url.Values{}
	body.Set("code", code)
	body.Set("client_id", clientID)
	body.Set("client_secret", clientSecret)
	body.Set("redirect_uri", redirectURI)
	body.Set("grant_type", "authorization_code")

	resp, err := http.PostForm("https://oauth2.googleapis.com/token", body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var tokenResp googleTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, err
	}
	if tokenResp.AccessToken == "" {
		return nil, NewError("no access_token in response", http.StatusUnauthorized)
	}
	return &tokenResp, nil
}

func GetGoogleUserInfo(accessToken string) (*googleUserInfo, error) {
	req, _ := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	req.Header.Set("Authorization", "Bearer "+accessToken)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var info googleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	return &info, nil
}

type tokeninfoResponse struct {
	Aud           string `json:"aud"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Exp           string `json:"exp"`
	Iss           string `json:"iss"`
	Name          string `json:"name"`
	Sub           string `json:"sub"`
}

func VerifyGoogleIDToken(idToken, clientID string) (*googleUserInfo, error) {
	if idToken == "" || clientID == "" {
		return nil, NewError("id_token and client_id are required", http.StatusBadRequest)
	}
	req, err := http.NewRequest("GET", "https://oauth2.googleapis.com/tokeninfo?id_token="+url.QueryEscape(idToken), nil)
	if err != nil {
		return nil, err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, NewError("invalid id token", http.StatusUnauthorized)
	}
	var info tokeninfoResponse
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	if info.Aud != clientID {
		return nil, NewError("audience mismatch", http.StatusUnauthorized)
	}
	if info.Iss != "accounts.google.com" && info.Iss != "https://accounts.google.com" {
		return nil, NewError("invalid issuer", http.StatusUnauthorized)
	}
	if info.Email == "" {
		return nil, NewError("email not in token", http.StatusUnauthorized)
	}
	name := info.Name
	if name == "" {
		name = info.Email
	}
	return &googleUserInfo{Email: info.Email, Name: name}, nil
}
