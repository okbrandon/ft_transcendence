package main

import (
	"net/http"
	"time"

	"transcendence/gameserver/internal/game"

	"github.com/charmbracelet/log"
)

func main() {
	log.SetTimeFormat(time.Kitchen)
	log.SetLevel(log.InfoLevel)

	game.Games = make(map[string]*game.Game)
	http.HandleFunc("/game", game.HandleGame)
	log.Info("Game server is ready", "port", "8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
