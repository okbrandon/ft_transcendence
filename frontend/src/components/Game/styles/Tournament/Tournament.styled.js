import styled from "styled-components";

export const TournamentOptionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	color: #fff;
	text-align: center;
	padding: 2rem;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;

	h1 {
		font-size: 3rem;
		font-family: 'Orbitron', sans-serif;
		margin-bottom: 5rem;
		text-transform: uppercase;
		letter-spacing: 5px;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.6),
			0 0 15px rgba(128, 0, 128, 0.4),
			0 0 20px rgba(75, 0, 130, 0.3);
	}
`;

export const OptionButton = styled.button`
	color: #fff;
	text-transform: uppercase;
	letter-spacing: 5px;
	border-radius: 15px;
	border: none;
	background-color: #1a1a1a;
	padding: 1.5rem 3rem;
	margin-bottom: 2rem;
	cursor: pointer;
	font-size: 1.5rem;
	transition: all 0.3s ease;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 8px rgba(59, 130, 246, 0.2);
	width: 80%;
	max-width: 500px;
	text-align: center;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 16px rgba(164, 69, 178, 0.4), 0 0 12px rgba(59, 130, 246, 0.4);
	}

	& > p {
		margin-top: 20px;
		font-size: 1rem;
		text-transform: none;
		color: rgba(255, 255, 255, 0.5);
	}
`;

export const UpcomingMatches = styled.div`
	position: absolute;
	right: 30px;
	top: 100px;
	width: 300px;
	background-color: rgba(20, 20, 30, 0.8);
	border-radius: 10px;
	padding: 20px;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
	font-family: 'Orbitron', sans-serif;
	color: #fff;

	h3 {
		font-size: 1.5rem;
		color: #f0f0f0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		padding-bottom: 10px;
		margin-bottom: 20px;
	}

	.match {
		background-color: rgba(40, 40, 60, 0.6);
		border-radius: 8px;
		padding: 10px;
		margin-bottom: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: all 0.3s ease;

		&:hover {
			background-color: rgba(60, 60, 80, 0.9);
		}

		.player {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 0.6rem;
			color: #b0b0b0;
		}
	}
	.current-match {
		border: 2px solid rgba(164, 69, 178, 0.8);
		border-radius: 8px;
		box-shadow: 0 0 15px rgba(164, 69, 178, 0.6),
					0 0 30px rgba(80, 120, 200, 0.2);
		background: rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.scrollable {
		max-height: 400px;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background-color: rgba(164, 69, 178, 0.6);
			border-radius: 10px;
		}
	}
`;
