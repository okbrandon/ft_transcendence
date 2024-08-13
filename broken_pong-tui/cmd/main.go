package main

import (
	"flag"
	"fmt"
	"os"
	"transcendence/pong-tui/internal/game"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	gateway := flag.String("gw", "ws://127.0.0.1:8089/game", "Gateway for the game server")
	gameID := flag.String("gameid", "", "Game to join")

	flag.Parse()

	game := game.NewGame(*gameID)
	err := game.ConnectToServer(*gateway)
	if err != nil {
		fmt.Printf("Oops something went wrong and i crashed, %v\n", err)
		return
	}

	p := tea.NewProgram(game, tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Oops something went wrong and i crashed: %v\n", err)
		os.Exit(1)
	}
}
