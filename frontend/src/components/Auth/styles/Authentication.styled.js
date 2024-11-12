import styled from "styled-components";
import Form from 'react-bootstrap/Form';

export const AuthenticationSection = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%);
	background-size: cover;
	background-position: center;
	position: relative;
	overflow: hidden;
`;

export const Outline = styled.div`
	padding-top: 2rem;

	& .card {
		background-image: linear-gradient(163deg, #3d0066 0%, #9b00e3 100%);
		border-radius: 27px;
		transition: all 0.3s;
		overflow: hidden;

		&:hover {
			box-shadow: 0px 0px 30px 3px rgba(155, 0, 227, 0.6);
		}
	}
	& .card2 {
		border-radius: 0;
		transition: all 0.2s;
		transform: scale(0.99);

		&:hover {
			border-radius: 20px;
			box-shadow: 0px 0px 20px 2px rgba(155, 0, 227, 0.4);
		}
	}
`;

export const FormContainer = styled(Form)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 0 7em 3em 7em;
	background-color: #171717;
	border-radius: 25px;
	transition: 0.4s ease-in-out;

	& > h1 {
		text-align: center;
		font-size: 2.5rem;
		color: #e1e1e1;
		margin: 2em 0 1em 0;
	}

	& > p {
		color: #a1a1a1;
		font-size: 13px;
		z-index: 2;
	}

	& .mb-3 {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 25px;
		padding: 0.6em;
		border: none;
		outline: none;
		color: white;
		background-color: #171717;
		box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.5);

		& > i {
			position: absolute;
			top: 14px;
			right: 20px;
			color: white;
			font-size: 1.2rem;
			z-index: 2;
			cursor: pointer;
		}

		& > .input-icon {
			padding-left: 0.7rem;
			font-size: 1.5rem;
			color: white;
		}
	}

	.mb-3 input {
		background: none;
		border: none;
		outline: none;
		width: 100%;
		color: #d3d3d3;
		font-size: 1rem;

		&::placeholder {
			color: #7f7f7f;
		}

		&:focus {
			user-select: none;
			outline: none;
			border: none;
			box-shadow: none;
		}
	}

	.mb-3 input:invalid {
		border: 2px solid #ff5f5f;
		border-radius: 8px;
	}

	& button {
		z-index: 1;
		width: 100%;
		background-color: #252525;
		color: white;
		font-size: 1rem;
		padding: 1em;
		border-radius: 25px;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover {
			background-color: black;
			box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.4);
		}
	}
`;

export const SubmitButton = styled.button`
	padding: 0.5em;
	padding-left: 1.1em;
	padding-right: 1.1em;
	border-radius: 5px;
	margin-right: 0.5em;
	border: none;
	outline: none;
	transition: 0.4s ease-in-out;
	background-color: #252525;
	color: white;

	&:hover {
		background-color: black;
		color: white;
	}
`;

export const LanguageDropdownButton = styled.select`
	padding: 0.3rem 0.4rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 8px;
	background: rgba(0, 0, 0, 1);
	color: #fff;
	font-size: 0.9rem;
	font-family: 'Orbitron', sans-serif;
	transition: background 0.3s ease, border 0.3s ease;
	margin-bottom: 15px;

	&:hover {
        background: rgba(75, 0, 130, 0.6);
        cursor: pointer;
        border: 1px solid rgba(164, 69, 178, 0.6);
    }

    &:focus {
        outline: none;
    }

    option {
        background-color: rgba(25, 25, 25, 1);
        color: #fff;
        padding: 10px;
    }
`;

export const FortyTwoButton = styled.button`
	padding: 0.5em;
	padding-left: 1.1em;
	padding-right: 1.1em;
	border-radius: 5px;
	margin-right: 0.5em;
	border: none;
	outline: none;
	transition: 0.4s ease-in-out;
	background-color: #252525;
	color: white;
	font-size: 1rem;

	& > img {
		width: 25px;
		height: 25px;
		border-radius: 10px;
		margin-right: 10px;
	}

	&:hover {
		background-color: black;
		color: white;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 1rem;
	margin-bottom: 1.5rem;
	border-radius: 5px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background-color: rgba(30, 30, 30, 0.8);
	color: #fff;
	font-size: 1rem;
	outline: none;
	transition: border-color 0.3s ease;

	&:focus {
		border-color: rgba(164, 69, 178, 0.7);
	}
`;
