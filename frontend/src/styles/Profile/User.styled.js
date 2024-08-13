import styled from 'styled-components';
import Image from 'react-bootstrap/Image';

export const UserContainer = styled.div`
	display: flex;
	justify-content: space-between;
	position: absolute;
	width: 80%;
	top: -100px;
	left: 10%;
`;

export const ProfileImageContainer = styled.div`
	display: flex;
	align-items: flex-end;

	& h2 {
		margin-bottom: 50px;
		margin-left: 30px;
		font-size: 2rem;
		font-weight: 900;
		position: relative;
		cursor: default;

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
`;

export const ProfileImage = styled(Image)`
	width: 190px;
	height: 190px;
	object-fit: cover;
	margin-bottom: 10px;
	border: 3px solid #fff;
`;

export const UserInfoContainer = styled.div`
	display: flex;
	justify-content: center;
	height: 195px;
	width: 600px;
	background: #15132f;
	border-radius: 30px;
`;

export const UserInfoItem = styled.div`
	display: flex;
	min-width: 180px;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	& #title {
		font-size: 25px;
		font-weight: 900;
	}

	& h2 {
		font-size: 28px;
		padding: 5px 0;
	}
`;

export const LevelContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	position: absolute;
	left: 10%;
	margin-top: 55px;
	margin-left: 220px;
	font-family: 'Inter', sans-serif;
	font-size: 16px;
	font-weight: 900;

	& > p {
		width: 92px;
		margin-top: 15px;
	}
`;