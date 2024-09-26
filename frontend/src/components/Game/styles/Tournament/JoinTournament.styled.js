import styled from "styled-components";

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	color: #fff;
	height: 100vh;
	width: 100%;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;

	h1 {
		font-size: 3rem;
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
		letter-spacing: 5px;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(128, 0, 128, 0.4), 0 0 20px rgba(75, 0, 130, 0.3);
	}
`;

export const JoinTournamentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 700px;
	padding: 2rem;
`;

export const PlayerList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	grid-auto-rows: 80px;
	border-radius: 12px;
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
	gap: 1rem;
	width: 100%;
	max-width: 900px;
	margin-bottom: 5rem;
	padding: 3rem;
`;

export const PlayerCard = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: linear-gradient(145deg, #2a2a2a, #383838);
	padding: 0.75rem 1.25rem;
	border-radius: 12px;
	transition: all 0.3s ease;
	font-weight: bold;
	color: #eaeaea;
	user-select: none;

	&:hover {
		background-color: #444;
		border-color: #fff;
		transform: translateY(-3px);
	}
`;

export const KickButton = styled.button`
	border: none;
	color: #ff5555;
	font-size: 1.2rem;
	background: none;
	cursor: pointer;
	padding: 0;
	transition: color 0.3s ease;

	&:hover {
		color: #ff7878;
	}
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	width: 100%;
`;

export const WaitingMessage = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-top: 2rem;
	color: #888;
	font-size: 1.2rem;
	font-style: italic;

	p {
		margin-bottom: 1rem;
	}

	.spinner-border {
		scale: 0.8;
		color: #888;
	}
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ModalContainer = styled.div`
	background-color: #1a1a1a;
	padding: 2rem;
	border-radius: 10px;
	width: 500px;
	max-height: 80vh;
	overflow-y: auto;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	text-align: center;
`;

export const FriendProfilePicture = styled.img`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	margin-right: 0.5rem;
`;

export const FriendItem = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 12px;
	padding: 1rem;
	margin-bottom: 1rem;
	font-size: 1.2rem;
	font-family: 'Inter', sans-serif;
	color: #fff;
	background: linear-gradient(145deg, #2a2a2a, #383838);
`;
