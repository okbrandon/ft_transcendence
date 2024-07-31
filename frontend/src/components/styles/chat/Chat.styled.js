import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
	from {
		transform: translateY(100%);
	} to {
		transform: translateY(0);
	}
`;

const slideDown = keyframes`
	from {
		transform: translateY(0);
	} to {
		transform: translateY(100%);
	}
`;

export const DropupContainer = styled.div`
	position: fixed;
	bottom: 0px;
	right: 20px;
	display: inline-block;
`;

export const DropupButton = styled.button`
	font-family: 'VT323', monospace;
	background-color: #000;
	border: 1px solid #ddd;
	color: #fff;
	padding: 10px;
	width: 200px;
	height: 50px;
	font-size: 16px;
	border-radius: 4px 4px 0 0;
	cursor: pointer;
	text-align: left;
	padding-left: 20px;
	position: relative;
	z-index: 2;

	&:hover {
		background-color: #ddd;
		color: #000;
	}

	&.expended {
		border-radius: 4px 4px 0 0;
	}
`;

export const DropupContent = styled.div`
	display: ${props => (props.show ? 'block' : 'none')};
	position: absolute;
	bottom: 50px;
	right: 0;
	background-color: #ddd;
	width: 200px;
	max-height: 300px;
	overflow-y: auto;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	z-index: 1;
	animation: ${props => (props.show ? slideUp : slideDown)} 0.3s forwards;
	padding-top: 50px;
	border-radius: 4px 4px 0 0;
`;

export const FriendItem = styled.div`
	padding: 12px 16px;
	border-bottom: 1px solid #ddd;
	cursor: pointer;

	&:hover {
		background-color: #ddd;
	}
`;
