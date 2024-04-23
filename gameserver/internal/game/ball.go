package game

import (
	"math/rand"

	"transcendence/gameserver/internal/consts"

	"github.com/charmbracelet/log"
)

type Ball struct {
	PositionX  int `json:"x"`
	PositionY  int `json:"y"`
	DirectionX int `json:"dx"` // between -1 and 1
	DirectionY int `json:"dy"` // between -1 and 1
}

func moveBall(game *Game) {
	ball := game.Ball
	if ball.isCollidingWithPlayer(game.Player1.PositionX+1, game.Player1.PositionY) {
		log.Debug("Ball collided with player 1")
		ball.bounceFromPlayer()
	}
	if ball.isCollidingWithPlayer(game.Player2.PositionX-1, game.Player2.PositionY) {
		log.Debug("Ball collided with player 2")
		ball.bounceFromPlayer()
	}

	if ball.isCollidingWithWall() {
		log.Debug("Ball collided with wall")
		ball.bounceFromWall()
	}

	// Update ball position
	ball.PositionX += ball.DirectionX
	ball.PositionY += ball.DirectionY

	// Check for score
	if ball.PositionX == consts.ScreenWidth-1 {
		game.Player1.Score++
		ball.Reset()
	} else if ball.PositionX == 0 {
		game.Player2.Score++
		ball.Reset()
	}
}

func newBall() *Ball {
	return &Ball{
		PositionX:  consts.ScreenWidth/2 - 1,
		PositionY:  consts.ScreenHeight / 2,
		DirectionX: 1,
		DirectionY: 1,
	}
}

func (b *Ball) bounceFromPlayer() {
	b.DirectionX *= -1
	b.DirectionY = rand.Intn(3) - 1 // -1, 0, or 1
}

func (b *Ball) bounceFromWall() {
	b.DirectionY *= -1
}

func (b *Ball) Reset() {
	b.PositionX = consts.ScreenWidth/2 - 1
	b.PositionY = consts.ScreenHeight / 2
	b.DirectionX = 1
	b.DirectionY = 0
}

func (b *Ball) isCollidingWithPlayer(posX int, posY [consts.PlayerHeight]int) bool {
	if b.PositionX == posX {
		for i := 0; i < len(posY); i++ {
			if b.PositionY == posY[i] {
				return true
			}
		}
	}
	return false
}

func (b *Ball) isCollidingWithWall() bool {
	return b.PositionY == 1 || b.PositionY == consts.ScreenHeight-1
}
