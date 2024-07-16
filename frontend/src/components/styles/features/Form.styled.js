import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

const StyledForm = styled(Form)`
	border-radius: 50px;
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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
		color: #c8c8c8;
		font-size: 13px;
	}

	& .form-control {
		border: none;
		border-radius: 0;
		border-bottom: 1px solid #dbdbdb;
		margin: 10px 0;
		&:focus {
			outline: none;
			box-shadow: none;
		}
	}
`;

export default StyledForm;
