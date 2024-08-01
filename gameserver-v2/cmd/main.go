package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"sync"
	"time"
	"transcendence/gameserver-v2/internal"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}
	activeTournaments = make(map[string]*internal.Tournament)
	tournamentMutex   sync.Mutex
)

func main() {
	rand.Seed(time.Now().UnixNano())

	http.Handle("/ws", corsMiddleware(http.HandlerFunc(handleWebSocket)))
	http.Handle("/create-tournament", corsMiddleware(http.HandlerFunc(handleCreateTournament)))

	internal.Logger.Info("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		internal.Logger.Fatal("ListenAndServe error:", "error", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		internal.Logger.Error("WebSocket upgrade error:", "error", err)
		return
	}
	defer conn.Close()

	userID := r.URL.Query().Get("userID")
	tournamentID := r.URL.Query().Get("tournamentID")

	tournamentMutex.Lock()
	tournament, exists := activeTournaments[tournamentID]
	tournamentMutex.Unlock()

	if !exists {
		internal.Logger.Error("Tournament not found", "tournamentID", tournamentID)
		return
	}

	player := &internal.Player{
		UserID:   userID,
		Username: r.URL.Query().Get("username"),
		Conn:     conn,
	}

	tournament.AddPlayer(player)
	defer tournament.RemovePlayer(player)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			internal.Logger.Error("WebSocket read error:", "error", err)
			break
		}

		var moveData struct {
			Move string `json:"move"`
		}
		if err := json.Unmarshal(message, &moveData); err != nil {
			internal.Logger.Error("JSON unmarshal error:", "error", err)
			continue
		}

		tournament.HandlePlayerMove(player, moveData.Move)
	}
}

func handleCreateTournament(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var tournamentData struct {
		TournamentID string   `json:"tournamentID"`
		Players      []string `json:"players"`
	}

	if err := json.NewDecoder(r.Body).Decode(&tournamentData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	tournamentMutex.Lock()
	defer tournamentMutex.Unlock()

	if _, exists := activeTournaments[tournamentData.TournamentID]; exists {
		http.Error(w, "Tournament already exists", http.StatusConflict)
		return
	}

	tournament := internal.NewTournament(tournamentData.TournamentID, tournamentData.Players)
	activeTournaments[tournamentData.TournamentID] = tournament

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "Tournament created. Waiting for all players to join."})
}
