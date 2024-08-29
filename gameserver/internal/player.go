package internal

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Player struct {
	UserID      string
	Username    string
	DisplayName string
	AvatarID    string
	Flags       []string
	Conn        *websocket.Conn
	paddle      Paddle
	lastMove    time.Time
	moveMutex   sync.Mutex
}

func (p *Player) CanMove() bool {
	p.moveMutex.Lock()
	defer p.moveMutex.Unlock()

	now := time.Now()
	if now.Sub(p.lastMove) < 100*time.Millisecond {
		return false
	}
	p.lastMove = now
	return true
}

func (p *Player) SendUpdate(update GameUpdate) {
	p.Conn.WriteJSON(update)
}
