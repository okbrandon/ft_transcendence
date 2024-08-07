import styled from "styled-components";
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';
import { motion } from 'framer-motion';

export const ProfileContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	width: 1000px;
	padding: 20px;
	min-height: 100vh;
`;

export const UserProfileContainer = styled.div`
	width: 100%;
	margin: 20px;
	display: flex;
	align-items: center;
`;

export const ProfileImageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;

	& h2 {
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
			background-image: linear-gradient(to right, #b865ff 45%, #b865ff4D 55%);
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
	border: 3px solid #b865ff;
`;

export const UserInfoContainer = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: relative;
	width: 600px;
	height: 175px;
	margin-left: 30px;
	padding: 0;
	background-repeat: no-repeat;
	background: radial-gradient(circle at center, #2d2d2d, transparent);
`;

export const TabsContainer = styled.div`
	width: 100%;
`;

export const ProfileTabs = styled(Tabs)`
	--bs-nav-link-color: #fff;
	--bs-nav-link-hover-color: #fff;
`;

export const MatchCardContainer = styled(motion.div)`
	padding: 10px;
	margin: 10px;
	border-radius: 20px;
	background: ${({ $won }) => $won ? 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(36,210,0,1) 100%)' : 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(255,0,0,1) 100%)'};
`;

export const MatchCard = styled.table`
	width: 100%;

	& td {
		width: calc(100% / 3);
		text-align: center;
		vertical-align: middle;
	}
`;
