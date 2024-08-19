import styled from 'styled-components';
import Button from 'react-bootstrap/esm/Button';

const FortyTwoButton = styled(Button)`
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	letter-spacing: 2px;
	z-index: 1;
	outline: none;

	& > img {
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
`;

export default FortyTwoButton;
