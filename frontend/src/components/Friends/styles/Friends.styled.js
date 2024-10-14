import styled from 'styled-components';

export const PageContainer = styled.div`
	padding: 2rem;
	color: #fff;
	min-height: 100vh;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;

	ul {
		margin-top: 2rem;
	}

	.nav-tabs {
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
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 80px auto 3rem auto;

	h1 {
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
`;

export const SearchInput = styled.input`
	padding: 0.8rem 1.2rem;
	font-size: 1rem;
	border-radius: 8px;
	border: 1px solid #444;
	background: #222;
	color: #fff;
	outline: none;
	transition: all 0.3s ease;

	&:focus {
		background: #333;
		box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
		border-color: rgba(164, 69, 178, 0.5);
	}
`;

export const ListContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, minmax(250px, 1fr));
	gap: 1.5rem;
	margin-top: 2rem;
`;

export const ListCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	padding: 1.5rem;
	border-radius: 15px;
	box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
	transition: all 0.3s ease;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0px 8px 30px rgba(255, 255, 255, 0.15), 0px 0px 20px rgba(164, 69, 178, 0.2);
	}
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
`;

export const ProfileAvatar = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
	object-fit: cover;
	border: 2px solid rgba(255, 255, 255, 0.2);
`;

export const ProfileStatus = styled.span`
	width: 12px;
	height: 12px;
	background: ${({ $status }) => $status === true ? "#00ff88" : "#ff5555"};
	border-radius: 50%;
	margin-right: 2rem;
	box-shadow: 0 0 10px ${({ $status }) => ($status === true ? "#00ff88" : "#ff5555")};
`;

export const ProfileInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 20px;
	margin-left: 10px;
`;

export const ProfileActivity = styled.p`
	font-size: 1rem;
	font-family: "Roboto", sans-serif;
	color: rgba(255, 255, 255, 0.5);
`;

export const Actions = styled.div`
	display: flex;
	gap: 1rem;
`;

export const NoRelation = styled.div`
	width: 100%;
	font-size: 1.2rem;
	color: #cccccc;
	text-align: center;
	margin-top: 2rem;
`;
