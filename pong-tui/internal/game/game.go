package game

import (
	"fmt"
	"time"
	"transcendence/pong-tui/internal/consts"

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
	timeLeft     int
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
			handleMessage(g, message)
		}
	}()

	return nil
}

func NewGame(gameID string) *Game {
	return &Game{
		gameID:       gameID,
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
			SendQuitting(g.conn)
			g.quitting = true
			return g, tea.Quit
		case key.Matches(msg, g.keymap.up):
			SendPaddleMove(g.conn, "up")
			g.me.MoveUp()
		case key.Matches(msg, g.keymap.down):
			SendPaddleMove(g.conn, "down")
			g.me.MoveDown()
		}
	}
	return g, nil
}

func (g *Game) View() string {
	screen := ""
	for i := 0; i < g.screenHeight; i++ {
		for j := 0; j < g.screenWidth; j++ {
			if i == 0 && j == g.screenWidth/2-2 {
				screen += fmt.Sprintf("%d (%ds left) %d", g.player1Score, g.timeLeft, g.player2Score)
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
