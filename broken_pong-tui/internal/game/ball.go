package game

import (
	"transcendence/pong-tui/internal/consts"
)

type Ball struct {
	PositionX  int
	PositionY  int
	directionX int // -1 or 1
	directionY int // between -1 and 1
}

func NewBall() *Ball {
	return &Ball{
		PositionX:  consts.ScreenWidth/2 - 1,
		PositionY:  consts.ScreenHeight / 2,
		directionX: 1,
		directionY: 0,
	}
}
