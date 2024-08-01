package internal

import (
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
}

func (p *Player) SendUpdate(update GameUpdate) {
	p.Conn.WriteJSON(update)
}
