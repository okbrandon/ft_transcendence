import styled from "styled-components";
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';

export const ProfileContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 150px auto 0 auto;
	width: 1000px;
	padding: 20px;
	min-height: 100vh;
`;

export const UserProfileContainer = styled.div`
	width: 100%;
	margin-bottom: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const ProfileImageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: 20px;

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
	justify-content: space-around;
	align-items: center;
	position: relative;
	width: 600px;
	height: 175px;
	background-repeat: no-repeat;
	background: radial-gradient(circle at center, #2d2d2d, transparent);
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
		padding: 10px 0;
	}
`;

export const TabsContainer = styled.div`
	width: 100%;
`;

export const ProfileTabs = styled(Tabs)`
	--bs-nav-link-color: #fff;
	--bs-nav-link-hover-color: #fff;

	& .nav-link {
		font-size: 20px;
	}
`;

export const MatchCardTable = styled.table`
	margin-top: 30px;
	width: 100%;
	border-collapse: collapse;
	text-align: center;

	& thead {
		background: #0f0f0f;
		font-size: 18px;
	}

	& th {
		padding: 30px;
	}

	& td {
		padding: 16px;
		font-size: 18px;
	}

	& tbody > tr:nth-child(even) {
		background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(201,201,201,0.6) 100%);
	}

	& tbody > tr:nth-child(odd) {
		background: linear-gradient(90deg, rgba(201,201,201,0.6) 0%, rgba(0,0,0,0.6) 100%);
	}
`;

export const ChartContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 600px;
`;

export const DonutChartContainer = styled.div`
	width: 500px;
	height: 500px;
`;
