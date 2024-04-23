package main

import (
	"fmt"
	"os"
	"transcendence/pong-tui/internal/game"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	gateway := "ws://127.0.0.1:8080/game"
	gwFromEnv := os.Getenv("GATEWAY")
	if gwFromEnv != "" {
		gateway = gwFromEnv
	}

	game := game.NewGame()
	err := game.ConnectToServer(gateway)
	if err != nil {
		// Handle error
		return
	}

	p := tea.NewProgram(game, tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Oops something went wrong and i crashed: %v", err)
		os.Exit(1)
	}
}
