package game

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

func dispatch(conn *websocket.Conn, event string, data map[string]string) {
	var payload map[string]interface{}

	if data == nil {
		payload = map[string]interface{}{
			"e": event,
		}
	} else {
		payload = map[string]interface{}{
			"e": event,
			"d": data,
		}
	}

	message, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error marshaling message:", err)
		return
	}

	err = conn.WriteMessage(websocket.TextMessage, message)
	if err != nil {
		log.Println("Error sending message:", err)
		return
	}
}

func handleMessage(g *Game, message []byte) {
	var data map[string]interface{}
	err := json.Unmarshal(message, &data)
	if err != nil {
		// Handle error
		return
	}

	switch data["e"] {
	case "GAME_UPDATE":
		handleGameUpdate(g, data["d"].(map[string]interface{}))
	case "BALL_UPDATE":
		handleBallUpdate(g, data["d"].(map[string]interface{}))
	case "SCORE_UPDATE":
		handleScoreUpdate(g, data["d"].(map[string]interface{}))
	case "OPPONENT_MOVE":
		handleOpponentMove(g, data["d"].(map[string]interface{}))
	case "HELLO":
		handleHello(g, data["d"].(map[string]interface{}))
	case "GAME_OVER":
		handleGameOver(g, data["d"].(map[string]interface{}))
	}
}

func SendPaddleMove(conn *websocket.Conn, direction string) {
	dispatch(conn, "PADDLE_MOVE", map[string]string{"direction": direction})
}

func SendQuitting(conn *websocket.Conn) {
	dispatch(conn, "PLAYER_QUIT", nil)
}

func SendIdentify(conn *websocket.Conn, token string) {
	dispatch(conn, "IDENTIFY", map[string]string{"token": token})
}

// For now this is ignored, values are currently hard-coded until I find
// a better way to do this
func handleGameUpdate(g *Game, data map[string]interface{}) {
	options := data["options"].(map[string]interface{})
	g.screenWidth = int(options["width"].(float64))
	g.screenHeight = int(options["height"].(float64))
	fps = data["fps"].(time.Duration)
	g.gameID = data["game_id"].(string)
	g.opponentName = data["opponent_name"].(string)
}

func handleBallUpdate(g *Game, data map[string]interface{}) {
	g.ball.PositionX = int(data["x"].(float64))
	g.ball.PositionY = int(data["y"].(float64))
}

func handleScoreUpdate(g *Game, data map[string]interface{}) {
	g.player1Score = int(data["me"].(float64))
	g.player2Score = int(data["opponent"].(float64))
	g.timeLeft = int(data["timeLeft"].(float64))
}

func handleOpponentMove(g *Game, data map[string]interface{}) {
	direction := data["direction"].(string)
	if direction == "up" {
		g.opponent.MoveUp()
	} else {
		g.opponent.MoveDown()
	}
}

func handleHello(g *Game, data map[string]interface{}) {
	if data["side"].(string) == "left" {
		g.me = g.player1
		g.opponent = g.player2
	} else {
		g.me = g.player2
		g.opponent = g.player1
	}
}

func handleGameOver(g *Game, data map[string]interface{}) {
	var playerSuckAtThisGame bool = data["winner"].(string) != g.me.name
	g.quitting = true

	if playerSuckAtThisGame {
		fmt.Println("You lost!")
	} else {
		fmt.Println("You won!")
	}

	time.Sleep(5 * time.Second)
	os.Exit(0)
}
