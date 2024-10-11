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
