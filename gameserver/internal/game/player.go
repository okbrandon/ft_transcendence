package game

import (
	"sync"
	"transcendence/gameserver/internal/consts"

	"github.com/gorilla/websocket"
)

type Player struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	PositionY   [consts.PlayerHeight]int
	PositionX   int
	Side        string `json:"side"` // left or right, first player is always left
	Score       int    `json:"score"`
	Connection  *websocket.Conn
	IsSpectator bool
	WriteMutex  sync.Mutex
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

func (p *Player) moveUp() {
	if p.PositionY[0]-1 < 0 {
		return
	}
	for i := 0; i < len(p.PositionY); i++ {
		p.PositionY[i]--
	}
}

func (p *Player) moveDown() {
	if p.PositionY[len(p.PositionY)-1]+1 >= consts.ScreenHeight {
		return
	}
	for i := 0; i < len(p.PositionY); i++ {
		p.PositionY[i]++
	}
}
