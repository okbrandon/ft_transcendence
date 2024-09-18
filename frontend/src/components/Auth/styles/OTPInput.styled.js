import styled from "styled-components";

export const OTPContainer = styled.div`
	display: flex;
	gap: 10px;
	justify-content: center;
	margin-bottom: 20px;
`;

export const OTPInput = styled.input`
	width: 40px;
	height: 50px;
	font-size: 2rem;
	text-align: center;
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-radius: 10px;
	background: transparent;
	color: rgba(255, 255, 255, 0.8);
	outline: none;
	transition: border-color 0.3s ease;

	&:focus {
		border-color: rgba(164, 69, 178, 0.7);
	}
`;

export const Hyphen = styled.span`
	display: flex;
	align-items: center;
	font-size: 24px;
	color: #fff;
	margin: 0 5px;
`;
