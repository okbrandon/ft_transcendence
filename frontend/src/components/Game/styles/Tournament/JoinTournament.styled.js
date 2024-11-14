import styled from "styled-components";

export const PageContainer = styled.div`
	color: #fff;
	height: 100vh;
	width: 100vw;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
	padding-top: calc(80px + 2rem);
`;

export const TournamentHeader = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

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
		text-align: center;
	}
`;

export const JoinTournamentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	width: 80%;
`;

export const PlayerListContainer = styled.div`
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
	width: 100%;
	height: 50vh;
	padding: 2rem;
	margin-top: 2rem;
	position: relative;
	display: flex;
	flex-direction: column;

	& > h3 {
		position: sticky;
		top: 0;
		z-index: 1;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 1rem;
		color: rgba(255, 255, 255, 0.8);
		z-index: 0;
	}
`;

export const PlayerList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	width: 100%;
	padding: 1rem;
	overflow-y: auto;
	margin-top: 1.3rem;
`;

export const PlayerCard = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: linear-gradient(145deg, #2a2a2a, #383838);
	width: 100%;
	border-radius: 12px;
	transition: all 0.3s ease;
	font-weight: bold;
	color: #eaeaea;
	user-select: none;
	padding: 1rem;

	& > .player-info {
		display: flex;
		align-items: center;
		gap: 20px;
		font-size: 1.2rem;
		position: relative;

		& > .owner {
			color: #f1c40f;
		}

		& > img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			object-fit: cover;
		}
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
	${(props) => props.$shouldMargin && 'margin-top: 2rem;'}
`;

export const WaitingMessage = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-top: 2rem;
	color: #888;
	font-size: 1.2rem;
	font-style: italic;

	.spinner-border {
		scale: 0.8;
		color: #888;
	}

	& > .waiting-text {
		display: flex;
		align-items: center;
		gap: 10px;
	}
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ModalContainer = styled.div`
	background-color: #1a1a1a;
	padding: 2rem;
	border-radius: 10px;
	width: 800px;
	height: 500px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;

	& > h2 {
		width: 100%;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 1rem;
	}
`;

export const ActiveFriendContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 300px;
	padding: 1rem;
	overflow-y: auto;
	scroll-behavior: smooth;
`;

export const FriendItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 12px;
	padding: 1rem 2rem;
	margin-bottom: 1rem;
	font-family: 'Inter', sans-serif;
	color: #fff;
	background: linear-gradient(145deg, #2a2a2a, #383838);
	width: 100%;

	& > .friend-info {
		font-size: 1.2rem;
	}
`;

export const FriendProfilePicture = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 50%;
	margin-right: 0.8rem;
	object-fit: cover;
`;
