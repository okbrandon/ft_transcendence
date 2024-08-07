import styled from "styled-components";

const PresentationDiv = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 600px;
	line-height: 2;
	letter-spacing: 1px;

	& > h1 {
		color: rgb(200,200,200);
		font-family: 'VT323';
		font-size: 90px;
		margin-bottom: 50px;
		z-index: 100;
	}

	& > p {
		font-size: 20px;
	}
`;

export default PresentationDiv;
