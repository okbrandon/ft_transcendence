package internal

import (
	"math/rand"
	"sync"
)

type Tournament struct {
	TournamentID    string
	ExpectedPlayers []string
	Players         []*Player
	Matches         []*Match
	CurrentRound    int
	mutex           sync.Mutex
	started         bool
}

func NewTournament(id string, expectedPlayers []string) *Tournament {
	return &Tournament{
		TournamentID:    id,
		ExpectedPlayers: expectedPlayers,
		Players:         make([]*Player, 0, len(expectedPlayers)),
	}
}

func (t *Tournament) AddPlayer(player *Player) {
	t.mutex.Lock()
	defer t.mutex.Unlock()

	// Check if the player is expected
	isExpected := false
	for _, expectedID := range t.ExpectedPlayers {
		if expectedID == player.UserID {
			isExpected = true
			break
		}
	}

	if !isExpected {
		Logger.Warn("Unexpected player tried to join", "tournamentID", t.TournamentID, "playerID", player.UserID)
		return
	}

	t.Players = append(t.Players, player)
	Logger.Info("Player added to tournament", "tournamentID", t.TournamentID, "playerID", player.UserID)

	// Check if all expected players have joined
	if len(t.Players) == len(t.ExpectedPlayers) && !t.started {
		go t.Start()
	}
}

func (t *Tournament) RemovePlayer(player *Player) {
	t.mutex.Lock()
	defer t.mutex.Unlock()

	for i, p := range t.Players {
		if p == player {
			t.Players = append(t.Players[:i], t.Players[i+1:]...)
			Logger.Info("Player removed from tournament", "tournamentID", t.TournamentID, "playerID", player.UserID)
			break
		}
	}
}

func (t *Tournament) Start() {
	t.mutex.Lock()
	if t.started {
		t.mutex.Unlock()
		return
	}
	t.started = true
	t.mutex.Unlock()

	Logger.Info("Tournament started", "tournamentID", t.TournamentID)

	for {
		t.mutex.Lock()
		playerCount := len(t.Players)
		t.mutex.Unlock()

		if playerCount < 2 {
			Logger.Info("Tournament ended due to insufficient players", "tournamentID", t.TournamentID)
			return
		}

		t.CurrentRound++
		Logger.Info("Starting new round", "tournamentID", t.TournamentID, "round", t.CurrentRound)

		matchups := t.createMatchups()
		winners := make([]*Player, 0, len(matchups))

		for _, matchup := range matchups {
			if matchup[1] == nil {
				// If there's no opponent, this player automatically advances
				winners = append(winners, matchup[0])
				continue
			}

			match := NewMatch(matchup[0], matchup[1])
			t.Matches = append(t.Matches, match)

			// Add spectators
			t.mutex.Lock()
			for _, player := range t.Players {
				if player != matchup[0] && player != matchup[1] {
					match.AddSpectator(player)
				}
			}
			t.mutex.Unlock()

			match.Start()

			// Determine winner
			var winner *Player
			if match.Scores[matchup[0].UserID] > match.Scores[matchup[1].UserID] {
				winner = matchup[0]
			} else {
				winner = matchup[1]
			}
			winners = append(winners, winner)
			Logger.Info("Match finished", "matchID", match.MatchID, "winner", winner.UserID)
		}

		t.mutex.Lock()
		t.Players = winners
		if len(t.Players) == 1 {
			Logger.Info("Tournament finished", "tournamentID", t.TournamentID, "winner", t.Players[0].UserID)
			t.mutex.Unlock()
			return
		}
		t.mutex.Unlock()
	}
}

func (t *Tournament) createMatchups() [][2]*Player {
	t.mutex.Lock()
	defer t.mutex.Unlock()

	rand.Shuffle(len(t.Players), func(i, j int) {
		t.Players[i], t.Players[j] = t.Players[j], t.Players[i]
	})

	matchups := make([][2]*Player, 0, len(t.Players)/2)
	for i := 0; i < len(t.Players); i += 2 {
		if i+1 < len(t.Players) {
			matchups = append(matchups, [2]*Player{t.Players[i], t.Players[i+1]})
		} else {
			// Handle odd number of players
			matchups = append(matchups, [2]*Player{t.Players[i], nil})
		}
	}

	return matchups
}

func (t *Tournament) HandlePlayerMove(player *Player, move string) {
	t.mutex.Lock()
	defer t.mutex.Unlock()

	for _, match := range t.Matches {
		if match.PlayerA == player || match.PlayerB == player {
			match.HandlePlayerMove(player, move)
			break
		}
	}
}
