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
	background: linear-gradient(80deg, rgba(150, 93, 233, 0.7) 10%, rgba(99, 88, 238, 0.7) 95%);
	border: none;
	color: #fff;

	&:hover {
		color: #fff;
	}
`;

export default PongButton;
