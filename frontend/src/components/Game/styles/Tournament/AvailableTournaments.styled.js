import styled from "styled-components";

export const AvailableTournamentsSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const AvailableTournamentsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 1200px;
	padding: 2rem;
	color: #fff;
	overflow-y: auto;
	height: 80vh;
	border: 1px solid #333;
	border-radius: 15px;
	position: relative;
	background-color: #111;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
	margin-top: 2rem;
`;

export const SearchBar = styled.input`
	width: 100%;
	max-width: 600px;
	padding: 1rem 1.5rem;
	margin-bottom: 2rem;
	border-radius: 10px;
	border: 1px solid #555;
	background-color: #111;
	color: #fff;
	font-size: 1rem;
	transition: all 0.3s ease;
	position: sticky;
	top: 0;
	z-index: 10;
	box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);

	&::placeholder {
		color: #888;
	}

	&:focus {
		outline: none;
		border-color: #fff;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
		background-color: #1a1a1a;
	}
`;

export const TournamentList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	width: 100%;
	padding-bottom: 2rem;
`;

export const TournamentCard = styled.div`
	width: 100%;
	background-color: #222;
	border: 1px solid #333;
	border-radius: 15px;
	padding: 1.5rem;
	text-align: center;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	h3 {
		font-size: 1.6rem;
		margin-bottom: 1rem;
		color: #fff;
	}

	p {
		color: #bbb;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		background-color: #333;
	}
`;

export const JoinButton = styled.button`
	padding: 0.8rem 2rem;
	border: none;
	border-radius: 8px;
	background-color: #444;
	color: #fff;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

	&:hover {
		background-color: #555;
		box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
		transform: translateY(-3px);
	}
`;
