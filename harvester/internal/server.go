package internal

import (
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Tables and columns where the userID is stored
var tablesAndColumns = map[string]string{
	"users": "userID",
}

func HandleWs(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
		return
	}

	log.Debug("Client Connected")

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Error(err)
			return
		}

		userID := string(message)
		log.Info("Received", "userID", userID)

		userData, err := getUserData(userID, tablesAndColumns)
		if err != nil {
			log.Error("Error fetching user data", "err", err)
			respondError(conn, "Failed to fetch user data")
			continue
		}

		if err := exportCSV(userID, userData); err != nil {
			log.Error("Error exporting CSV", "err", err)
			respondError(conn, "Failed to export user data to CSV")
			continue
		}

		if err := zipAndMove(userID); err != nil {
			log.Error("Error creating ZIP file", "err", err)
			respondError(conn, "Failed to create ZIP file")
			continue
		}

		conn.WriteMessage(websocket.TextMessage, []byte("ZIP export successful"))
	}
}

func respondError(conn *websocket.Conn, message string) {
	conn.WriteMessage(websocket.TextMessage, []byte(message))
}
