import styled from 'styled-components';
import Image from 'react-bootstrap/Image';

export const ProfileImageContainer = styled.div`
	position: absolute;
	top: -100px;
	transform: translateX(-50%);
	left: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;

	& > h2 {
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
	position: absolute;
	width: 190px;
	height: 190px;
	object-fit: cover;
	margin-bottom: 10px;
`;

export const UserInfoContainer = styled.div`
	display: flex;
	justify-content: center;
	height: 160px;
	width: 600px;
	background: radial-gradient(circle at center, #1A183A, transparent);
	border-radius: 30px;
	margin-top: 30px;
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

export const UserSpacer = styled.div`
	width: 100%;
	background: #000;
	height: 450px;
`;
