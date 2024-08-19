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
	height: 800px;

	& > h2 {
		height: 100px;
		padding-top: 30px;
		margin: 0 auto;
		font-family: 'Orbitron', serif;
		font-size: 2rem;
		font-weight: 600;
		text-align: center;
		width: 100%;
		border-bottom: 1px solid rgba(255,255,255,1);
		border-radius: 50px 50px 0 0;
		background: #000;
	}
	
	& > i {
		position: absolute;
		font-size: 2rem;
		top: 25px;
		left: 35px;
		cursor: pointer;
		
		&:hover {
			color: rgba(255,255,255,0.8);
		}
	}
`;

export const SettingsItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 0 0 50px 50px;
	position: relative;
	height: 700px;
`;

export const SettingsItem = styled.div`
	width: 100%;
	flex-grow: ${props => (props.$expanded ? 2 : 1)};
	flex-basis: max-content;
	transition: flex-grow 0.3s ease;
	overflow: hidden;
`;

export const SettingsDropdown = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: ${props => props.$expanded ? '100px' : '100%'};
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
	padding-top: 50px;

	& .mb-3 {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		width: 400px;
		position: relative;

		& > p {
			position: absolute;
			bottom: -12px;
			right: 20px;
			font-family: 'Inter', serif;
			font-size: 0.8rem;
			color: rgba(255,255,255,0.2);
		}
	}

	& .form-label {
		color: rgba(255,255,255,0.8);
		font-family: 'Inter', serif;
		font-size: 1rem;
		font-weight: 600;
		user-select: none;

		& > i {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 1.5rem;
		}
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