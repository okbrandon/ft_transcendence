package game

import (
	"transcendence/pong-tui/pkg/consts"
	"transcendence/pong-tui/pkg/utils"
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

func (b *Ball) Move(player1, player2 *Player) {

	if b.isCollidingWithPlayer(player1.PositionX+1, player1.PositionY) {
		b.bounceFromPlayer()
	}

	if b.isCollidingWithPlayer(player2.PositionX-1, player2.PositionY) {
		b.bounceFromPlayer()
	}

	if b.isCollidingWithWall() {
		b.bounceFromWall()
	}

	b.PositionX += 1 * b.directionX
	b.PositionY += b.directionY
}

func (b *Ball) bounceFromPlayer() {
	b.directionX *= -1
	b.directionY = utils.GenerateRandomNumber(-1, 1)
}

func (b *Ball) bounceFromWall() {
	b.directionY *= -1
}

func (b *Ball) Reset() {
	b.PositionX = consts.ScreenWidth/2 - 1
	b.PositionY = consts.ScreenHeight / 2
	b.directionX = 1
	b.directionY = 0
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
	if b.PositionY == 1 || b.PositionY == consts.ScreenHeight-1 {
		return true
	}
	return false
}
