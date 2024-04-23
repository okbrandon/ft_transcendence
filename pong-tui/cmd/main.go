package main

import (
	"fmt"
	"os"
	"transcendence/pong-tui/pkg/game"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	game := game.NewGame()
	err := game.ConnectToServer("ws://127.0.0.1:8080/game")
	if err != nil {
		// Handle error
		return
	}
	err = tea.NewProgram(game, tea.WithAltScreen()).Start()
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}
