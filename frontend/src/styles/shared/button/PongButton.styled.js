import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const PongButton = styled(Button)`
	position: relative;
	font-family: sans-serif;
	font-weight: 800;
	font-size: 35px;
	cursor: pointer;
	width: 300px;
	height: 70px;
	letter-spacing: 2px;
	z-index: 500;
`;

export default PongButton;
