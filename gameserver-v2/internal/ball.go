package internal

type Ball struct {
	X  float64
	Y  float64
	DX float64
	DY float64
}

func (b *Ball) Move() {
	b.X += b.DX
	b.Y += b.DY
}

func (b *Ball) CheckCollision(p1, p2 *Paddle) bool {
	// Check collision with top/bottom walls
	if b.Y <= 0 || b.Y >= 600 {
		b.DY = -b.DY
		Logger.Info("Ball hit wall", "position", b.Y)
		return false
	}

	// Check collision with paddles
	if (b.X <= 20 && b.Y >= p1.Y && b.Y <= p1.Y+p1.Height) ||
		(b.X >= 780 && b.Y >= p2.Y && b.Y <= p2.Y+p2.Height) {
		b.DX = -b.DX
		Logger.Info("Ball hit paddle", "position", b.X)
		return false
	}

	// Check if ball is out of bounds (point scored)
	if b.X <= 0 || b.X >= 800 {
		Logger.Info("Point scored", "position", b.X)
		return true
	}

	return false
}
