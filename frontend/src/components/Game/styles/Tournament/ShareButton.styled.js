import styled from 'styled-components';

export const Button = styled.button`
	background-color: ${(props) => (props.copied ? '#4caf50' : '#6a0dad')};
	color: white;
	padding: 10px 20px;
	margin-top: 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.3s;

	&:hover {
		background-color: ${(props) => (props.copied ? '#45a049' : '#5a0ca0')};
	}
`;
