import styled from "styled-components";

export const PageContainer = styled.div.attrs({
	style: {
		display: 'flex',
		position: 'relative',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		background: `
			radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
			linear-gradient(135deg, #000000 0%, #111111 100%)
		`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
})``;

export const ScoreContainer = styled.div.attrs({
	style: {
		position: 'absolute',
		top: '10px',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		gap: '120px',
		padding: '0 40px',
		fontFamily: "'Orbitron', sans-serif",
		color: '#fff',
	},
})``;

export const Score = styled.div.attrs({
	style: {
		fontSize: '5rem',
		fontWeight: 'bold',
		textShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
	},
})``;

export const LeaveButton = styled.button.attrs({
	style: {
		position: 'absolute',
		bottom: '20px',
		left: '50%',
		transform: 'translateX(-50%)',
		padding: '10px 20px',
		border: 'none',
		borderRadius: '20px',
	},
})`
	&:hover {
		background: rgba(200, 200, 200, 1);
	}
`;

export const ProfilesContainer = styled.div.attrs({
	style: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '1200px',
		marginBottom: '20px',
	},
})`
	& > p {
		font-size: 1.5rem;
		font-family: 'Orbitron', sans-serif;
		color: rgba(255, 255, 255, 0.2);
		position: relative;
		background-clip: text;
		-webkit-background-clip: text;
	}
`;

export const Profile = styled.div.attrs({
	style: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '20px',
	},
})``;

export const ProfileImage = styled.img.attrs({
	style: {
		width: '40px',
		height: '40px',
		borderRadius: '50%',
		objectFit: 'cover'
	},
})``;

export const ProfileName = styled.h2.attrs({
	style: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: '2rem',
		color: '#fff',
	},
})``;

export const GameContainer = styled.div.attrs({
	style: {
		position: 'relative',
		border: '3px solid rgba(255, 255, 255, 0.2)',
		borderRadius: '20px',
		width: '1200px',
		height: '750px',
		background: 'radial-gradient(circle, rgba(20, 20, 20, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)',
		boxShadow: '0 0 20px rgba(164, 69, 178, 0.7), 0 0 30px rgba(59, 130, 246, 0.4)',
		overflow: 'hidden',
		margin: '0 auto',
	},
})``;

export const GameSeparator = styled.div.attrs({
	style: {
		position: 'absolute',
		height: '100%',
		left: '50%',
		transform: 'translateX(-50%)',
		borderLeft: '2px dashed rgba(255, 255, 255, 0.4)',
		boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
	},
})``;

export const PongBall = styled.div.attrs(({ x, y }) => ({
	style: {
		position: 'absolute',
		width: '25px',
		height: '25px',
		left: `${x}px`,
		top: `${y}px`,
		borderRadius: '50%',
		background: 'radial-gradient(circle, #ffffff, rgba(255, 255, 255, 1))',
		boxShadow: '0 0 30px rgba(255, 255, 255, 0.7)',
		transition: 'transform 0.1s ease-out',
	},
}))``;

export const PongPaddle = styled.div.attrs(({ $side, $leftPaddleTop, $rightPaddleTop }) => ({
	style: {
		position: 'absolute',
		left: $side === 'left' ? '10px' : 'auto',
		right: $side === 'left' ? 'auto' : '10px',
		top: $side === 'left' ? `${$leftPaddleTop}px` : `${$rightPaddleTop}px`,
		width: '20px',
		height: '120px',
		background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
		borderRadius: '10px',
		boxShadow: '0 0 30px rgba(255, 255, 255, 0.8)',
		transition: 'top 0.1s ease-out',
		overflow: 'hidden',
	},
}))``;
