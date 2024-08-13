import styled from "styled-components";
import Form from 'react-bootstrap/Form';

export const AuthenticationContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
`;

export const FormContainer = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 50px;
	background: linear-gradient(to bottom, #fff 0%, #bfbfbf 100%);
	position: relative;
	width: 600px;
	height: 600px;
	color: black;
	z-index: 1;

	& > h1 {
		font-size: 40px;
		padding-bottom: 40px;
	}

	& > p {
		color: #ababab;
		font-size: 13px;
	}

	& .form-control {
		border: none;
		border-radius: 0;
		background-color: transparent;
		border-bottom: 1px solid #c9c9c9;
		margin: 10px 0;
		&:focus {
			outline: none;
			box-shadow: none;
		}
	}
`;
