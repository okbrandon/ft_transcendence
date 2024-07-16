import styled from 'styled-components';

const StyledHeader = styled.h1`
	font-size: 200px;
	text-align: center;
	margin-bottom: 100px;
	position: relative;
	user-select: none;

	&::before {
		content: '';
		position: absolute;
		height: 20px;
		width: 200px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 35px;
		width: 35px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;

export default StyledHeader;
