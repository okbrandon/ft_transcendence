import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const StyledButtonPong = styled(Button)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: sans-serif;
	font-weight: 900;
	font-size: 35px;
	cursor: pointer;
	width: 400px;
	height: 70px;
	letter-spacing: 2px;
	z-index: 1;
`;

export default StyledButtonPong;