import styled from 'styled-components';

export const PageContainer = styled.div`
	padding: 2rem;
	background: linear-gradient(135deg, #000 0%, #111 100%);
	color: #fff;
	min-height: 100vh;
	margin-top: 80px;

	ul {
		margin-top: 2rem;
	}

	.nav-link {
		color: #fff;
		background-color: #222;
		border-top: 1px solid #333;
		border-left: 1px solid #333;
		border-right: 1px solid #333;
		border-bottom: none;
		border-radius: 5px;
		margin-right: 5px;
		margin-bottom: 1px;
		transition: all 0.3s ease;
		font-family: "Orbitron", sans-serif;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		text-align: center;

		&:hover {
			background-color: #333;
			color: #fff;
			box-shadow: none;
		}

		&.active {
			background-color: #101010;
			border-color: #555;
			color: #fff;
			box-shadow: none;
		}
	}
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	margin: 0 auto;

	h1 {
		font-family: "Orbitron", sans-serif;
	}
`;

export const SearchInput = styled.input`
	padding: 0.8rem 1rem;
	font-size: 1rem;
	border-radius: 8px;
	border: none;
	background: #222;
	color: #fff;
	outline: none;
	transition: all 0.3s ease;

	&:focus {
		background: #333;
		box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.4);
	}
`;


