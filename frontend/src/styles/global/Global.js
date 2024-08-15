import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		max-width: 100%;
	}

	::-webkit-scrollbar {
		width: 7px;
	}
	::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.5);
	}
	::-webkit-scrollbar-thumb {
		background: #888;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	html, body {
		background-color: #000;
		color: white;
		height: 100vh;
		width: 100vw;
		margin: 0;
		padding: 0;
		font-family: 'Poppins', sans-serif;
	}
`;

export default GlobalStyles;
