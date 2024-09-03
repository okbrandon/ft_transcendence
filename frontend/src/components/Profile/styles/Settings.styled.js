import styled from "styled-components";
import Form from 'react-bootstrap/Form';

export const SectionContainer = styled.div`
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	top: 0;
	width: 100%;
	height: 100vh;
	backdrop-filter: blur(20px);
`;


export const SettingsItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 10px;
	overflow-y: auto;
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 150px;
	border-bottom: 1px solid rgba(255,255,255,0.1);
	border-radius: 10px 10px 0 0;
	background: #000;

	h2 {
		justify-self: center;
		font-family: 'Orbitron', serif;
		font-size: 2rem;
		font-weight: 600;
		text-align: center;
	}

	i {
		position: absolute;
		font-size: 2rem;
		cursor: pointer;
		left: 0;
		margin-left: 20px;

		&:hover {
			color: rgba(255,255,255,0.8);
		}
	}
`;

export const SettingsForm = styled(Form)`
	margin-top: 50px;
	width: 50rem;
	height: 70vh;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 1px solid rgba(255,255,255,0.1);
	border-bottom: none;
	border-radius: 10px;
	background: rgba(0,0,0,0.8);

	& .mb-3 {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
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

		& > h3 {
			position: absolute;
			top: -18px;
			left: 50px;
			font-family: 'Inter', serif;
			font-size: 0.8rem;
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

	& > ${SettingsItemContainer} {
		flex-grow: 1;
		overflow-y: auto;
	}
`;

export const SettingsItem = styled.div`
	display: flex;
	flex-direction: center;
	justify-content: center;
	align-items: center;
	margin: 20px 0;
	width: ${props => props.$width || '100%'};
`;

export const ErrorMessage = styled.p`
	color: red;
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100px;
	width: 100%;
	padding: 10px;
	border-top: 1px solid rgba(255,255,255,0.1);
	border-bottom: 1px solid rgba(255,255,255,0.1);
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	background: #000;

	button {
		position: absolute;
		right: 20px;
	}
`;

export const Separator = styled.div`
	margin: 20px 0;
	width: 100%;
	height: 1px;
	border-top: 1px solid rgba(255,255,255,0.2);
`;

export const PreviewProfilePictureContainer = styled.div`
	width: 100px;
	height: 100px;
	margin: 0 auto 20px auto;
`;

export const PreviewBannerContainer = styled.div`
	height: 200px;
	width: 70%;
	margin: 0 auto 20px auto;
`;

export const Preview = styled.img`
	height: ${({ $isProfile }) => $isProfile ? '100px' : '200px'};
	width: ${({ $isProfile }) => $isProfile ? '100px' : '100%'};
	${({ $isProfile }) => $isProfile && 'border-radius: 50%'};
	object-fit: cover;
`;
