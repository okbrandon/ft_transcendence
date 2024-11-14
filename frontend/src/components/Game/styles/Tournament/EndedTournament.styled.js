import styled, { keyframes } from 'styled-components';

export const EndTournamentContainer = styled.div`
	display: flex;
	height: 100vh;
	width: 100vw;
	padding-top: 80px;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	font-family: 'Orbitron', sans-serif;
	position: relative;
	overflow: hidden;

	@keyframes moveDown {
		100% {
			transform: translateY(100%);
			opacity: 0;
		}
	}

	${props => !props.$loading && `
		&::before {
			content: '';
			position: absolute;
			top: -200%;
			left: 0;
			width: 100%;
			height: 300%;
			background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
			z-index: 100;
			animation: moveDown 2s ease-in forwards;
		}
	`}
`;

export const WinnerContainer = styled.div`
	width: 40vw;
	height: calc(100vh - 80px);
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-right: 1px solid #2e2e3d;
`;

export const WinnerDiv = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 10;
	gap: 50px;
	position: relative;
	top: -50px;

	& > h2 {
		font-size: 2rem;
		font-family: 'Poppins', sans-serif;
		color: #fff;
		margin-top: 20px;
	}
`;

export const WinnerInfo = styled.div`
	display: flex;
	gap: 50px;
	border-radius: 25px;
	padding: 50px;
	border: 3px solid #3f3f3f;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url(${props => props.$background});
		background-size: cover;
		background-position: center;
		border-radius: 20px;
		opacity: 0.5;
		z-index: -1;
	}

	& > img {
		width: 150px;
		height: 150px;
		border-radius: 25%;
		object-fit: cover;
		border: 3px solid #3f3f3f;
		box-shadow: 0 0 100px rgba(255, 255, 255, 0.7);
	}

	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		& > h3:hover {
			color: rgba(164, 69, 178, 1);
			cursor: pointer;
		}
	}
`;

export const TournamentOverview = styled.div`
	width: 60vw;
	height: calc(100vh - 80px);
	display: flex;
	flex-direction: column;
	margin-top: 20px;
	position: relative;
	padding: 50px;

	& > #leave-button {
		font-family: 'Inter', sans-serif;
		position: absolute;
		top: 0;
		right: 20px;
		background-color: rgba(200, 50, 50, 0.8);
		color: #fff;
		border-radius: 5px;
		border: 1px solid #cc3333;
		padding: 10px 20px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 1rem;
		text-transform: uppercase;

		&:hover {
			background-color: rgba(255, 50, 50, 0.9);
			box-shadow: 0 0 15px rgba(255, 50, 50, 0.5);
		}
	}

	.nav-tabs {
		margin-top: 40px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.nav-link {
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		border: 1px solid #333;
		border-radius: 5px;
		margin-right: 5px;
		transition: all 0.3s ease;
		font-family: "Orbitron", sans-serif;
		font-size: 1rem;
		padding: 0.8rem 1rem;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 1px;

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
			color: #fff;
			border: 1px solid #333;
			box-shadow: 0 0 10px rgba(164, 69, 178, 0.3);
		}

		&.active {
			background-color: rgba(164, 69, 178, 0.1);
			color: #fff;
			border: 1px solid #333;
			box-shadow: 0 0 15px rgba(164, 69, 178, 0.7);
		}
	}

	.tab-content {
		margin-top: 20px;

		& table,
		& #linestats {
			margin: 0 auto;
		}
	}
`;

export const TournamentHeader = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;

	& > h1 {
		font-family: "Orbitron", sans-serif;
		font-size: 3rem;
		letter-spacing: 4px;
		color: #fff;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.6),
			0 0 15px rgba(128, 0, 128, 0.4),
			0 0 20px rgba(75, 0, 130, 0.3);
	}

	& > h2 {
		font-family: "Orbitron", sans-serif;
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.8);
		margin-top: 20px;
	}

	& > p {
		font-family: 'Poppins', sans-serif;
		color: rgba(255, 255, 255, 0.6);
	}
`;

export const MatchCardTable = styled.table`
	width: 90%;
	border-collapse: collapse;
	font-family: 'Arial', sans-serif;
	background-color: #0b0b12;
	border-radius: 10px;
	overflow: hidden;
	margin-top: 30px;

	thead {
		background-color: #181823;
		color: white;
		text-transform: uppercase;
		font-size: 16px;
		font-weight: 600;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	th {
		border-bottom: 1px solid #292933;
	}
	tr {
		&:not(:last-child) {
			border-bottom: 1px solid #292933;
		}
	}

	th, td {
		padding: 20px;
		text-align: center;
	}

	td.versus {
		position: relative;

		&::after {
			content: 'VS';
			position: absolute;
			right: -12px;
			color: #b5b5c5;
			pointer-events: none;
		}
	}

	td.hover {
		&:hover {
			color: rgba(164, 69, 178, 1);
		}
	}

	tbody {
		display: block;
		max-height: 380px;
		overflow-y: auto;
		width: 100%;

		::-webkit-scrollbar {
			width: 10px;
		}

		::-webkit-scrollbar-thumb {
			background-color: #ff005c;
			border-radius: 10px;
		}

		::-webkit-scrollbar-track {
			background-color: #181823;
		}
	}

	thead, tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	tbody tr {
		background-color: #101018;
	}

	tbody tr.visible {
		background-color: #292933;
	}

	td {
		font-size: 18px;
		color: #b5b5c5;
	}

	td.profile {
		cursor: pointer;
	}

	th {
		font-size: 18px;
		color: #ccccdd;
	}
`;

const move = keyframes`
	100% {
		transform: translate3d(0, 0, 1px) rotate(360deg);
	}
`;

export const Background = styled.div`
	position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
	z-index: 0;

	& > span {
		width: 20vmin;
		height: 20vmin;
		border-radius: 20vmin;
		backface-visibility: hidden;
		position: absolute;
		animation: ${move} 45s linear infinite;
	}

	& > span:nth-child(0) {
		color: #E45A84;
		top: 63%;
		left: 40%;
		animation-duration: 40s;
		animation-delay: -24s;
		transform-origin: -14vw 4vh;
		box-shadow: 84vmin 0 10.56524869333168vmin currentColor;
	}

	& > span:nth-child(1) {
		color: #FFACAC;
		top: 73%;
		left: 90%;
		animation-duration: 52s;
		animation-delay: -28s;
		transform-origin: -16vw -10vh;
		box-shadow: -84vmin 0 10.815576698507503vmin currentColor;
	}

	& > span:nth-child(2) {
		color: #FFACAC;
		top: 95%;
		left: 50%;
		animation-duration: 44s;
		animation-delay: -11s;
		transform-origin: 1vw -21vh;
		box-shadow: 84vmin 0 10.723817069085785vmin currentColor;
	}

	& > span:nth-child(3) {
		color: #E45A84;
		top: 46%;
		left: 34%;
		animation-duration: 16s;
		animation-delay: -25s;
		transform-origin: -7vw 22vh;
		box-shadow: -84vmin 0 10.698185744343258vmin currentColor;
	}

	& > span:nth-child(4) {
		color: #583C87;
		top: 25%;
		left: 57%;
		animation-duration: 15s;
		animation-delay: -2s;
		transform-origin: 24vw 4vh;
		box-shadow: 84vmin 0 10.796136526786704vmin currentColor;
	}

	& > span:nth-child(5) {
		color: #E45A84;
		top: 63%;
		left: 45%;
		animation-duration: 49s;
		animation-delay: -14s;
		transform-origin: 1vw -24vh;
		box-shadow: -84vmin 0 11.326802174805692vmin currentColor;
	}

	& > span:nth-child(6) {
		color: #583C87;
		top: 42%;
		left: 92%;
		animation-duration: 48s;
		animation-delay: -36s;
		transform-origin: 10vw -21vh;
		box-shadow: -84vmin 0 11.156977302807881vmin currentColor;
	}

	& > span:nth-child(7) {
		color: #E45A84;
		top: 56%;
		left: 90%;
		animation-duration: 8s;
		animation-delay: -44s;
		transform-origin: -19vw -2vh;
		box-shadow: -84vmin 0 11.335648982627658vmin currentColor;
	}

	& > span:nth-child(8) {
		color: #583C87;
		top: 13%;
		left: 68%;
		animation-duration: 33s;
		animation-delay: -26s;
		transform-origin: 23vw 17vh;
		box-shadow: 84vmin 0 11.061375816520007vmin currentColor;
	}
`;
