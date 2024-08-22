import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const PongButton = styled(Button)`
	background: linear-gradient(135deg, #111111, #333333);
	color: #fff;
	font-family: 'Orbitron', sans-serif;
	font-size: 30px;
	padding: 15px 30px;
	border: none;
	border-radius: 50px;
	cursor: pointer;
	text-transform: uppercase;
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
	transition: all 0.1s ease-in-out;
	outline: none;
	cursor: pointer;
	z-index: 500;
	--bs-btn-active-color: #fff;

	&:hover {
		color: #fff;
		background: linear-gradient(135deg, #222222, #555555);
		box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.3);
		transform: scale(1.05);
	}

	&:active {
		background: linear-gradient(135deg, #1A1A1A, #333333);
		box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
		transform: scale(0.98);
	}
`;

export default PongButton;
