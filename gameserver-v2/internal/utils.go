package internal

import (
	"fmt"
	"time"
)

type GameUpdate struct {
	BallX    float64        `json:"ballX"`
	BallY    float64        `json:"ballY"`
	Paddle1Y float64        `json:"paddle1Y"`
	Paddle2Y float64        `json:"paddle2Y"`
	Scores   map[string]int `json:"scores"`
}

func generateID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
