import styled from "styled-components";

export const ToggleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 1rem 0;
`;

export const ToggleLabel = styled.span`
	font-size: 1rem;
	margin-right: 10px;
	color: #fff;
`;

export const ToggleSwitch = styled.label`
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;

	input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	input:checked + span {
		background-color: #4caf50;
	}

	input:checked + span:before {
		transform: translateX(26px);
	}
`;

export const Slider = styled.span`
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 0.4s;
	border-radius: 34px;

	&:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}
`;

export const QRCodeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(20, 20, 20, 0.5);
	padding: 2rem;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
	max-width: 400px;
	margin: 0 auto;
`;

export const QRCodeText = styled.p`
	color: rgba(255, 255, 255, 0.9);
	font-family: 'Inter', sans-serif;
	margin-bottom: 1.5rem;
	font-size: 1.1rem;
	text-align: center;
`;

export const QRCodeWrapper = styled.div`
	margin-bottom: 1.5rem;
	background-color: #fff;
	padding: 1rem;
	border-radius: 10px;
`;
