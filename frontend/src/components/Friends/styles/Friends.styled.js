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

	.nav-link {
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		border: 1px solid #333;
		border-radius: 5px;
		margin-right: 5px;
		margin-bottom: 1px;
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
