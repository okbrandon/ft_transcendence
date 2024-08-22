import styled from "styled-components";

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
`;

export const JoinTournamentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 50vh;
	max-width: 700px;
	margin: auto;
	padding: 2rem;
	background-color: #111;
	color: #fff;
	text-align: center;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
	border-radius: 15px;

	h1 {
		font-family: "Orbitron", sans-serif;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	h2 {
		font-family: "Roboto", sans-serif;
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: #ccc;
	}
`;

export const PlayerList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	grid-auto-rows: 80px;
	gap: 1rem;
	width: 100%;
	max-width: 600px;
	margin-bottom: 2rem;
	padding: 1rem;
	border-radius: 15px;
	background-color: #222;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
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
	box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);

	&:hover {
		background-color: #444;
		border-color: #fff;
		transform: translateY(-3px);
		cursor: pointer;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
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

export const InviteButton = styled.button`
	background: radial-gradient(circle, #555, #444);
	color: #fff;
	border: none;
	border-radius: 25px;
	padding: 1rem 2rem;
	margin-bottom: 2rem;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0px 6px 15px rgba(255, 255, 255, 0.1);

	&:hover {
		background: radial-gradient(circle, #666, #555);
		box-shadow: 0px 10px 25px rgba(255, 255, 255, 0.3);
	}
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
