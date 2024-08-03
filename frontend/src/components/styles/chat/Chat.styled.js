import styled, { keyframes } from 'styled-components';

// Keyframe animations for sliding up and down
const slideUp = keyframes`
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
`;

const slideDown = keyframes`
	from { transform: translateY(0); }
	to { transform: translateY(100%); }
`;

export const DropupContainer = styled.div`
	position: fixed;
	bottom: 50px;
	right: 20px;
	width: 200px;
`;

export const DropupButton = styled.button`
	font-family: 'VT323', monospace;
	background-color: #000;
	border: 1px solid #ddd;
	color: #fff;
	padding: 10px;
	width: 100%;
	height: 50px;
	font-size: 16px;
	cursor: pointer;
	text-align: left;
	padding-left: 20px;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	border-radius: 4px 4px 0 0;

	&:hover {
		background-color: #ddd;
		color: #000;
	}

	&.expanded {
		border-radius: 4px 4px 0 0;
	}
`;

export const DropupContent = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: #000;
	width: 100%;
	max-height: 300px;
	overflow-y: auto;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	z-index: 1;
	animation: ${props => (props.show ? slideUp : slideDown)} 0.3s forwards;
	border-radius: 4px 4px 0 0;
	padding-top: 50px; /* Space for the button */
	border: 1px solid #ddd;
`;

export const FriendItem = styled.div`
	padding: 12px 16px;
	border-bottom: 1px solid #ddd;
	cursor: pointer;

	&:hover {
		background-color: #ddd;
	color: #000;
	}
`;
