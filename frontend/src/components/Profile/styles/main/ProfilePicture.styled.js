import styled from "styled-components";
import Image from 'react-bootstrap/Image';

export const SectionContainer = styled.div`
	position: absolute;
	top: -130px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;

	& > h2 {
		text-align: center;
		font-size: 2rem;
		font-weight: 700;
		position: relative;
		cursor: default;
		margin-top: 20px;
		word-spacing: 5px;

		&:hover::before {
			background-position: 0% 50%;
		}

		&::before {
			content: '';
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 2px;
			background-image: linear-gradient(to right, #ffffff 45%, #ffffff4D 55%);
			background-repeat: no-repeat;
			background-size: 220% 100%;
			background-position: 100% 50%;
			transition: 0.3s ease-out;
		}
	}
	
	& > h3 {
		font-size: 1.5rem;
		margin-top: 5px;
		color: rgb(200,200,200);
	}
`;

export const ProfilePictureContainer = styled.div`
	width: 190px;
	height: 190px;
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
	width: 190px;
	height: 190px;
	object-fit: cover;
`;
