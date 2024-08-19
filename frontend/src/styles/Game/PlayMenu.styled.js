import styled from "styled-components";

export const PlayMenuContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 50px;
	height: 100vh;
	width: 100%;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/images/play-background.jpg');
		background-repeat: no-repeat;
		background-size: cover;
		opacity: 0.2; /* Adjust the opacity as needed */
	}
`;

export const PlayMenuCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 1px solid #fff;
	border-radius: 10px;
	width: 500px;
	height: 500px;
	background: rgb(0,0,0);
	z-index: 1;

	&:hover {
		background: rgb(10,10,10);
		cursor: pointer;
	}
	
	h1 {
		text-transform: uppercase;
		letter-spacing: 10px;
	}
`;
