import styled from "styled-components";

export const JoinTournamentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 700px;
	margin: auto;
	padding: 2rem;
	height: 100vh;
	background-color: #000;
	color: #fff;
	text-align: center;
`;

export const PlayerList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* Responsive grid */
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
	background-color: #333;
	padding: 0.5rem 1rem;
	border: 1px solid #444;
	border-radius: 10px;
	text-align: center;
	font-weight: bold;
	color: #fff;
	transition: all 0.3s ease;

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
	background-color: #444;
	color: #fff;
	border: none;
	border-radius: 10px;
	padding: 1rem 2rem;
	margin-bottom: 2rem;
	cursor: pointer;
	font-size: 1rem;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

	&:hover {
		background-color: #555;
		box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
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
