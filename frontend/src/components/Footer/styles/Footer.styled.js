import styled from "styled-components";

export const FooterContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #000;
	z-index: 100;
	padding: 30px 0;

	& .privacy-policy {
		&:hover {
			cursor: pointer;
			color: rgba(255, 255, 255, 0.8);
		}
	}
`;
