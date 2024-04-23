package game

import (
	"encoding/json"
	"fmt"
	"time"
	"transcendence/pong-tui/pkg/consts"

	"github.com/charmbracelet/bubbles/help"
	"github.com/charmbracelet/bubbles/key"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/gorilla/websocket"
)

var fps time.Duration = 30

type Game struct {
	screenWidth  int
	screenHeight int
	ball         *Ball
	me           *Player
	opponent     *Player
	player1      *Player
	player2      *Player
	keymap       keymap
	help         help.Model
	quitting     bool
	player1Score int
	player2Score int
	conn         *websocket.Conn
	gameID       string
	opponentName string
}

type keymap struct {
	up   key.Binding
	down key.Binding
	quit key.Binding
}

type tickMsg time.Time

func updateBallPosition() tea.Cmd {
	now := time.Now()
	timeSince := time.Second * 2 / fps
	return tea.Tick(timeSince, func(t time.Time) tea.Msg {
		return tickMsg(now)
	})
}

func (g *Game) Init() tea.Cmd {
	return updateBallPosition()
}

func (g *Game) ConnectToServer(url string) error {
	var err error
	g.conn, _, err = websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		return err
	}

	go func() {
		for {
			_, message, err := g.conn.ReadMessage()
			if err != nil {
				// Handle error
				return
			}
			g.handleMessage(message)
		}
	}()

	return nil
}

func (g *Game) handleMessage(message []byte) {
	var data map[string]interface{}
	err := json.Unmarshal(message, &data)
	if err != nil {
		// Handle error
		return
	}

	switch data["e"] {
	case "GAME_UPDATE":
		g.handleGameUpdate(data["d"].(map[string]interface{}))
	case "BALL_UPDATE":
		g.handleBallUpdate(data["d"].(map[string]interface{}))
	case "SCORE_UPDATE":
		g.handleScoreUpdate(data["d"].(map[string]interface{}))
	case "OPPONENT_MOVE":
		g.handleOpponentMove(data["d"].(map[string]interface{}))
	case "HELLO":
		g.handleHello(data["d"].(map[string]interface{}))
	}
}

// For now this is ignored, values are currently hard-coded until I find
// a better way to do this
func (g *Game) handleGameUpdate(data map[string]interface{}) {
	options := data["options"].(map[string]interface{})
	g.screenWidth = int(options["width"].(float64))
	g.screenHeight = int(options["height"].(float64))
	fps = data["fps"].(time.Duration)
	g.gameID = data["game_id"].(string)
	g.opponentName = data["opponent_name"].(string)
}

func (g *Game) handleBallUpdate(data map[string]interface{}) {
	g.ball.PositionX = int(data["x"].(float64))
	g.ball.PositionY = int(data["y"].(float64))
}

func (g *Game) handleScoreUpdate(data map[string]interface{}) {
	g.player1Score = int(data["me"].(float64))
	g.player2Score = int(data["opponent"].(float64))
}

func (g *Game) handleOpponentMove(data map[string]interface{}) {
	direction := data["direction"].(string)
	if direction == "up" {
		g.opponent.MoveUp()
	} else {
		g.opponent.MoveDown()
	}
}

func (g *Game) handleHello(data map[string]interface{}) {
	if data["side"].(string) == "left" {
		g.me = g.player1
		g.opponent = g.player2
	} else {
		g.me = g.player2
		g.opponent = g.player1
	}
}

func NewGame() *Game {
	return &Game{
		screenWidth:  consts.ScreenWidth,
		screenHeight: consts.ScreenHeight,
		ball:         NewBall(),
		player1:      NewPlayer("Player 1", 1),
		player2:      NewPlayer("Player 2", 2),
		keymap: keymap{
			up: key.NewBinding(
				key.WithKeys("w"),
				key.WithHelp("w", "move up"),
			),
			down: key.NewBinding(
				key.WithKeys("s"),
				key.WithHelp("s", "move down"),
			),
			quit: key.NewBinding(
				key.WithKeys("q"),
				key.WithHelp("q", "quit game"),
			),
		},
		help: help.New(),
	}
}

func (g *Game) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tickMsg:
		if false { // handle game ending
			return g, nil
		}
		return g, updateBallPosition()
	case tea.KeyMsg:
		switch {
		case key.Matches(msg, g.keymap.quit):
			g.quitting = true
			return g, tea.Quit
		case key.Matches(msg, g.keymap.up):
			g.sendPaddleMove("up")
			g.me.MoveUp()
		case key.Matches(msg, g.keymap.down):
			g.sendPaddleMove("down")
			g.me.MoveDown()
		}
	}
	return g, nil
}

func (g *Game) sendPaddleMove(direction string) {
	message, _ := json.Marshal(map[string]interface{}{
		"e": "PADDLE_MOVE",
		"d": map[string]string{"direction": direction},
	})
	g.conn.WriteMessage(websocket.TextMessage, message)
}

func (g *Game) View() string {
	screen := ""
	for i := 0; i < g.screenHeight; i++ {
		for j := 0; j < g.screenWidth; j++ {
			if i == 0 && j == g.screenWidth/2-2 {
				screen += fmt.Sprintf("%d - %d", g.player1Score, g.player2Score)
				j += 4 // Skip the next 4 cells to avoid overwriting the score
			} else {
				screen += g.render(i, j)
			}
		}
		screen += "\n"
	}
	if !g.quitting {
		screen += "\n" + g.helpView()
	}
	return screen
}

func (g *Game) helpView() string {
	bindings := []key.Binding{
		g.keymap.up,
		g.keymap.down,
		g.keymap.quit,
	}
	return g.help.ShortHelpView(bindings)
}

func (g *Game) Reset() {
	g.ball.Reset()
	g.player1.Reset()
	g.player2.Reset()
}
