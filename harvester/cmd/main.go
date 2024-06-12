package main

import (
	"net/http"
	"transcendence/harvester/internal"

	"github.com/charmbracelet/log"
)

func main() {
	http.HandleFunc("/ws", internal.HandleWs)

	log.Info("WebSocket server starting", "port", "8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe", "err", err)
	}
}
