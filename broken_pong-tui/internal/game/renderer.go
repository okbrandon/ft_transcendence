package game

func (g *Game) render(i int, j int) string {

	if g.ball.PositionX == j && g.ball.PositionY == i {
		return "⬤"
	}

	if g.player1.PositionX == j {
		for k := 1; k < len(g.player1.PositionY); k++ {
			if i == g.player1.PositionY[k] {
				return "┃"
			}
		}
	}
	if g.player2.PositionX == j {
		for k := 1; k < len(g.player2.PositionY); k++ {
			if i == g.player2.PositionY[k] {
				return "┃"
			}
		}
	}
	return " "
}
