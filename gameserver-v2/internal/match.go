package internal

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Match struct {
	MatchID     string
	PlayerA     *Player
	PlayerB     *Player
	Scores      map[string]int
	StartedAt   time.Time
	FinishedAt  time.Time
	ball        Ball
	spectators  []*Player
	paddleMutex sync.Mutex
}

func (m *Match) HandlePlayerMove(player *Player, move string) {
	if !player.CanMove() {
		player.Conn.WriteMessage(websocket.TextMessage, []byte(`{"error": "You cannot move yet"}`))
	}

	m.paddleMutex.Lock()
	defer m.paddleMutex.Unlock()

	var paddle *Paddle
	if player == m.PlayerA {
		paddle = &m.PlayerA.paddle
	} else if player == m.PlayerB {
		paddle = &m.PlayerB.paddle
	} else {
		return // Player not in this match
	}

	switch move {
	case "up":
		paddle.Y -= 10
	case "down":
		paddle.Y += 10
	}

	// Ensure paddle stays within bounds
	if paddle.Y < 0 {
		paddle.Y = 0
	} else if paddle.Y+paddle.Height > 600 {
		paddle.Y = 600 - paddle.Height
	}

	// Broadcast updated paddle positions
	m.broadcastGameState()
}

func NewMatch(playerA, playerB *Player) *Match {
	return &Match{
		MatchID: generateID(),
		PlayerA: playerA,
		PlayerB: playerB,
		Scores:  make(map[string]int),
		ball: Ball{
			X:  400,
			Y:  300,
			DX: 5,
			DY: 5,
		},
	}
}

func (m *Match) Start() {
	m.StartedAt = time.Now()
	Logger.Info("Match started", "matchID", m.MatchID, "playerA", m.PlayerA.UserID, "playerB", m.PlayerB.UserID)

	// Initialize paddle positions
	m.PlayerA.paddle = Paddle{Y: 250, Height: 100}
	m.PlayerB.paddle = Paddle{Y: 250, Height: 100}

	ticker := time.NewTicker(10 * time.Millisecond)
	defer ticker.Stop()

	for round := 1; round <= 3; round++ {
		m.ball = Ball{X: 400, Y: 300, DX: 5, DY: 5}
		for {
			<-ticker.C
			m.ball.Move()
			if m.ball.CheckCollision(&m.PlayerA.paddle, &m.PlayerB.paddle) {
				if m.ball.X <= 0 {
					m.Scores[m.PlayerB.UserID]++
					Logger.Info("Point scored", "player", m.PlayerB.UserID, "score", m.Scores[m.PlayerB.UserID])
				} else {
					m.Scores[m.PlayerA.UserID]++
					Logger.Info("Point scored", "player", m.PlayerA.UserID, "score", m.Scores[m.PlayerA.UserID])
				}
				break
			}
			m.broadcastGameState()
		}
	}

	m.FinishedAt = time.Now()
	Logger.Info("Match finished", "matchID", m.MatchID, "scores", m.Scores)
}

func (m *Match) broadcastGameState() {
	update := GameUpdate{
		BallX:    m.ball.X,
		BallY:    m.ball.Y,
		Paddle1Y: m.PlayerA.paddle.Y,
		Paddle2Y: m.PlayerB.paddle.Y,
		Scores:   m.Scores,
	}

	updateJSON, err := json.Marshal(update)
	if err != nil {
		Logger.Error("Failed to marshal game update", "error", err)
		return
	}

	m.PlayerA.Conn.WriteMessage(websocket.TextMessage, updateJSON)
	m.PlayerB.Conn.WriteMessage(websocket.TextMessage, updateJSON)
	for _, spectator := range m.spectators {
		spectator.Conn.WriteMessage(websocket.TextMessage, updateJSON)
	}
}

func (m *Match) AddSpectator(player *Player) {
	m.spectators = append(m.spectators, player)
}

func (m *Match) RemoveSpectator(player *Player) {
	for i, spectator := range m.spectators {
		if spectator == player {
			m.spectators = append(m.spectators[:i], m.spectators[i+1:]...)
			break
		}
	}
}
