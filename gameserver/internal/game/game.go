package game

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"
	"transcendence/gameserver/internal/consts"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
)

type Game struct {
	ID        string    `json:"id"`
	Player1   *Player   `json:"player1"`
	Player2   *Player   `json:"player2"`
	Ball      *Ball     `json:"ball"`
	StartTime time.Time `json:"startTime"`
	TimeLeft  int       `json:"timeLeft"`
	Started   bool      `json:"started"`
}

var Games map[string]*Game

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func HandleGame(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error(err)
		return
	}

	player := &Player{
		ID:         GenerateID("player"),
		Connection: conn,
		PositionY:  initPositionY(),
	}
	log.Info("Player connected", "id", player.ID)

	game, isNewGame := findOrCreateGame(player)
	if isNewGame {
		player.Side = "left"
		player.PositionX = initPositionX(1)
		log.Info("Created a new game", "id", game.ID, "player1", player.ID)
		go gameLoop(game)
	} else {
		player.Side = "right"
		player.PositionX = initPositionX(2)
		log.Info("Player joined a game", "id", game.ID, "player2", player.ID)
	}

	hello, _ := json.Marshal(map[string]interface{}{
		"e": "HELLO",
		"d": map[string]interface{}{
			"side":         player.Side,
			"screenWidth":  consts.ScreenWidth,
			"screenHeight": consts.ScreenHeight,
			"playerHeight": consts.PlayerHeight,
			"fps":          consts.FPS,
		},
	})

	conn.WriteMessage(websocket.TextMessage, hello)

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Error(err)
			return
		}

		var data map[string]interface{}
		err = json.Unmarshal(message, &data)
		if err != nil {
			log.Error(err)
			return
		}

		switch data["e"] {
		case "PADDLE_MOVE":
			if game.Started {
				handlePaddleMove(game, player, data["d"].(map[string]interface{})["direction"].(string))
				log.Debug("Paddle move event received", "player", player.ID, "direction", data["d"].(map[string]interface{})["direction"].(string))
			}
		}

		if err := conn.WriteMessage(messageType, message); err != nil {
			log.Error(err)
			return
		}
	}
}

func findOrCreateGame(player *Player) (*Game, bool) {
	for _, game := range Games {
		if game.Player2 == nil {
			game.Player2 = player
			return game, false
		}
	}

	// Create a new game
	game := &Game{
		ID:        GenerateID("game"),
		Player1:   player,
		Ball:      newBall(),
		StartTime: time.Now(),
		TimeLeft:  consts.InitialGameTime,
	}
	Games[game.ID] = game
	return game, true
}

func gameLoop(game *Game) {
	for game.Player2 == nil {
		time.Sleep(100 * time.Millisecond)
	}

	game.Started = true
	game.StartTime = time.Now()

	ticker := time.NewTicker(time.Second / time.Duration(consts.FPS))
	defer ticker.Stop()

	for range ticker.C {
		game.TimeLeft = int(consts.InitialGameTime - int(time.Since(game.StartTime).Seconds()))
		if game.TimeLeft <= 0 {
			break
		}

		moveBall(game)
		sendUpdates(game)
	}

	// Send final score update and close connections
	sendUpdates(game)
	game.Player1.Connection.Close()
	game.Player2.Connection.Close()

	var winner *Player
	if game.Player1.Score > game.Player2.Score {
		winner = game.Player1
	} else {
		winner = game.Player2
	}
	gameOver, _ := json.Marshal(map[string]interface{}{
		"e": "GAME_OVER",
		"d": map[string]interface{}{
			"winner": winner.Name,
		},
	})

	game.Player1.Connection.WriteMessage(websocket.TextMessage, gameOver)
	game.Player2.Connection.WriteMessage(websocket.TextMessage, gameOver)
	delete(Games, game.ID)
}

func sendUpdates(game *Game) {
	ballUpdate, _ := json.Marshal(map[string]interface{}{
		"e": "BALL_UPDATE",
		"d": game.Ball,
	})

	game.Player1.Connection.WriteMessage(websocket.TextMessage, ballUpdate)
	game.Player2.Connection.WriteMessage(websocket.TextMessage, ballUpdate)

	scoreUpdate, _ := json.Marshal(map[string]interface{}{
		"e": "SCORE_UPDATE",
		"d": map[string]interface{}{
			"me":       game.Player1.Score,
			"opponent": game.Player2.Score,
			"timeLeft": game.TimeLeft,
		},
	})

	game.Player1.Connection.WriteMessage(websocket.TextMessage, scoreUpdate)
	game.Player2.Connection.WriteMessage(websocket.TextMessage, scoreUpdate)

	var data map[string]interface{}
	json.Unmarshal(ballUpdate, &data)
	log.Debug("Dispatching event to players", "type", "BALL_UPDATE", "raw", data["d"])
	json.Unmarshal(scoreUpdate, &data)
	log.Debug("Dispatching event to players", "type", "SCORE_UPDATE", "raw", data["d"])
}

func handlePaddleMove(game *Game, player *Player, direction string) {
	switch direction {
	case "up":
		player.moveUp()
	case "down":
		player.moveDown()
	}

	log.Debug("Dispatching event to players", "type", "OPPONENT_MOVE", "direction", direction, "from", player.ID)
	if game.Player2.Connection == player.Connection {
		game.Player1.Connection.WriteMessage(websocket.TextMessage, []byte(`{"e":"OPPONENT_MOVE","d":{"direction":"`+direction+`"}}`))
	} else {
		game.Player2.Connection.WriteMessage(websocket.TextMessage, []byte(`{"e":"OPPONENT_MOVE","d":{"direction":"`+direction+`"}}`))
	}
}

func GenerateID(prefix string) string {
	// Format is prefix_epoch
	return prefix + "_" + strconv.FormatInt(time.Now().UnixMicro(), 10)
}
