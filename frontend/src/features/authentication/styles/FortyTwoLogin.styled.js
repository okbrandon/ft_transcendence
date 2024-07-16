import styled from 'styled-components';
import Button from 'react-bootstrap/esm/Button';

const FortyTwoLoginButton = styled(Button)`
	font-size: 12px;
	cursor: pointer;
	letter-spacing: 2px;
	z-index: 2;
	margin-bottom: 30px;
	outline: none;

	& > img {
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
`;

export default FortyTwoLoginButton;
