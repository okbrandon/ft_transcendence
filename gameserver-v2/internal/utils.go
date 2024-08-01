package internal

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type GameUpdate struct {
	BallX    float64        `json:"ballX"`
	BallY    float64        `json:"ballY"`
	Paddle1Y float64        `json:"paddle1Y"`
	Paddle2Y float64        `json:"paddle2Y"`
	Scores   map[string]int `json:"scores"`
}

type User struct {
	UserID   string `json:"userID"`
	Username string `json:"username"`
}

func GetUserFromToken(token string) (*User, error) {
	req, err := http.NewRequest("GET", "http://backend:8000/v1/users/@me", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get user info: %s", resp.Status)
	}

	var user User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByID(userID string) (*User, error) {
	Logger.Debug("Creating new HTTP request", "userID", userID)
	req, err := http.NewRequest("GET", fmt.Sprintf("http://backend:8000/__internal/check_user_exists/%s", userID), nil)
	if err != nil {
		Logger.Error("Failed to create HTTP request", "error", err)
		return nil, err
	}

	client := &http.Client{}
	Logger.Debug("Sending HTTP request", "url", req.URL.String())
	resp, err := client.Do(req)
	if err != nil {
		Logger.Error("Failed to send HTTP request", "error", err)
		return nil, err
	}
	defer func() {
		Logger.Debug("Closing response body")
		resp.Body.Close()
	}()

	Logger.Debug("Received HTTP response", "status", resp.StatusCode)
	if resp.StatusCode != http.StatusOK {
		errMsg := fmt.Sprintf("failed to get user info: %s", resp.Status)
		Logger.Error(errMsg)
		return nil, fmt.Errorf(errMsg)
	}

	var user User
	Logger.Debug("Decoding response body into User struct")
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		Logger.Error("Failed to decode response body", "error", err)
		return nil, err
	}

	Logger.Debug("Successfully retrieved user", "user", user)
	return &user, nil
}

func generateID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
