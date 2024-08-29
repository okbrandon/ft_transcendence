package internal

type Paddle struct {
	Y      float64
	Height float64
}

func (p *Paddle) Move(direction string) {
	switch direction {
	case "up":
		p.Y -= 5
	case "down":
		p.Y += 5
	}

	// Ensure paddle stays within bounds
	if p.Y < 0 {
		p.Y = 0
	} else if p.Y+p.Height > 600 {
		p.Y = 600 - p.Height
	}
}
