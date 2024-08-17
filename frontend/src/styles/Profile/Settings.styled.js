import styled from "styled-components";
import Form from 'react-bootstrap/Form';

export const SettingsLayout = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(20px);
`;

export const SettingsContainer = styled.div`
	position: absolute;
	top: 50vh;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 50px;
	background: rgba(0,0,0,0.8);
	width: 50rem;
	height: 70vh;
`;

export const SettingsDropdown = styled.div`
	width: 100%;
	height: 100px;
	background: rgb(5,5,5);
	text-align: center;
	padding: 25px 0;
	cursor: pointer;
	user-select: none;
	border-bottom: 1px solid rgba(255,255,255,0.1);

	&:hover {
		background: rgb(10,10,10);
	}

	& > h2 {
		font-family: 'Inter', serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: rgba(255,255,255,0.8);
		letter-spacing: 2px;
	}
`;

export const SettingsForm = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100px;

	& .mb-3 {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		width: 300px;
	}

	& .form-label {
		color: rgba(255,255,255,0.8);
		font-family: 'Inter', serif;
		font-size: 1rem;
		font-weight: 600;
		user-select: none;
	}

	& .form-control {
		background: rgba(0,0,0,0.1);
		color: #fff;

		&:focus {
			outline: none;
			box-shadow: none;
		}

		&::placeholder {
			color: rgba(255,255,255,0.3);
		}
	}

	& .row {
		margin: 10px;
	}
`;