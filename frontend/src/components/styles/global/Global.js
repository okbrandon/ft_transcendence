import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
	@font-face {
		font-family: 'VT323';
		src: url('./fonts/VT323-Regular.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
		max-width: 100%;
	}

	html, body {
		display: relative;
		background-color: #000;
		color: white;
		height: 100vh;
		width: 100vw;
		margin: 0;
		padding: 0;
	}
`;

export default GlobalStyles;
