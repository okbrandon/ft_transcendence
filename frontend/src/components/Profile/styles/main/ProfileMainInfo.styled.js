import styled from "styled-components";
import Image from 'react-bootstrap/Image';

export const SectionContainer = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 25px;
	height: 100%;
	padding-left: 150px;
	padding-right: 200px;
	background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%);

	& > h2 {
		text-align: center;
		font-size: 2rem;
		font-weight: 700;
		margin-top: 20px;
		word-spacing: 5px;
	}
`;

export const ProfilePictureContainer = styled.div`
	width: 195px;
	height: 195px;
	position: relative;

	& > div {
		position: absolute;
	}

	& > p {
		position: absolute;
		bottom: -25px;
		left: 50%;
		transform: translateX(-50%);
		border: 2px solid rgba(0,0,0,0.5);
		min-width: 30px;
		min-height: 30px;
		padding: 0 5px;
		text-align: center;
		font-size: 18px;
		border-radius: 50%;
		background: rgb(240,240,240);
		color: black;
		font-weight: 600;
	}
`;

export const ProfileImage = styled(Image)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 190px;
	height: 190px;
	object-fit: cover;
`;

export const ProfileActionContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 8px;
`;

export const ProfileUsername = styled.h1`
	font-size: 2.5rem;
	font-weight: 700;
	color: rgba(255, 255, 255, 0.9);
`;

export const ProfileDisplayName = styled.h2`
	font-size: 1.5rem;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.9);
`;

export const ActionsContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	margin-top: 20px;
`;

export const ActionButton = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background: rgba(255, 255, 255, 0.08);
	padding: 12px 20px;
	border: 2px solid rgba(255, 255, 255, 0.15);
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s ease-in-out;
	box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);

	font-size: 1.1rem;
	color: rgba(255, 255, 255, 0.85);

	&:hover {
		background-color: rgba(164, 69, 178, 0.3);
		border-color: rgba(164, 69, 178, 0.6);
		box-shadow: 0 4px 15px rgba(164, 69, 178, 0.3), 0 0 12px rgba(255, 255, 255, 0.2);
		transform: translateY(-2px); /* Slight lift on hover */
	}

	i {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.85);
	}

	&:disabled {
		background: rgba(100, 100, 100, 0.3);
		border-color: rgba(100, 100, 100, 0.5);
		color: rgba(200, 200, 200, 0.5);
		cursor: not-allowed;
		box-shadow: none;

		i {
			color: rgba(200, 200, 200, 0.5);
		}
	}
`;
