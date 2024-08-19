import styled from "styled-components";

export const PlayMenuContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 50px;
	height: 100vh;
	width: 100%;
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

	&:hover {
		background: rgb(10,10,10);
		cursor: pointer;
	}
	
	h1 {
		text-transform: uppercase;
		letter-spacing: 10px;
	}
`;
