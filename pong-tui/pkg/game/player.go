package game

import (
	"transcendence/pong-tui/pkg/consts"
)

type Player struct {
	name      string
	number    int // 1 or 2
	PositionY [consts.PlayerHeight]int
	PositionX int
	height    int
}

func NewPlayer(name string, number int) *Player {
	return &Player{
		name:      name,
		number:    number,
		PositionY: initPositionY(),
		PositionX: initPositionX(number),
		height:    consts.PlayerHeight,
	}

}

func initPositionY() [consts.PlayerHeight]int {
	positions := [consts.PlayerHeight]int{}
	for i := 0; i < consts.PlayerHeight; i++ {
		positions[i] = (consts.ScreenHeight-consts.PlayerHeight)/2 + i
	}
	return positions
}

func initPositionX(number int) int {
	if number == 1 {
		return 0
	} else {
		return consts.ScreenWidth - 1
	}
}

func (p *Player) MoveUp() {
	if (p.PositionY[0] - 1) < 0 {
		return
	}

	for i := 0; i < len(p.PositionY); i++ {
		p.PositionY[i]--
	}
}

func (p *Player) MoveDown() {
	if (p.PositionY[len(p.PositionY)-1] + 1) >= consts.ScreenHeight {
		return
	}

	for i := 0; i < len(p.PositionY); i++ {
		p.PositionY[i]++
	}
}
