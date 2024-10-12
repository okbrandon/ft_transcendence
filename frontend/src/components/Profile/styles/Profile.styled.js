import styled, { keyframes } from "styled-components";

export const ProfileContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100vh;
	border: 1px solid transparent;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const UserProfileBannerContainer = styled.div`
	position: relative;
	width: 80%;
	margin: 150px auto 0 auto;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
`;

export const UserProfileBanner = styled.div`
	width: 100%;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 300px;
	background-repeat: no-repeat;
	${props => props.$path ? `background-image: url(${props.$path});` : 'background-color: #111;'}
	background-size: cover;
	background-position: center;
`;

export const UserContainer = styled.div`
	display: grid;
	grid-template-columns: 60% 40%;
	gap: 30px;
	width: 70%;
	margin-top: 30px;
`;

export const UserInfoContainer = styled.div`
	grid-column: 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	gap: 50px;
	border-radius: 10px;
	background-color: rgba(0, 0, 0, 0.6);
	padding: 50px;
`;

export const UserInfoItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 20px;
	width: 100%;
	padding: 30px;
	border-radius: 10px;
	background-color: rgba(0, 0, 0, 0.8);
	position: relative;
	border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const UserInfoItemTitle = styled.h3`
	font-size: 1.5rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
`;

const movePaddle = keyframes`
	0% {
		transform: translateX(100%);
	}
	50% {
		transform: translateX(110%);
	}
	100% {
		transform: translateX(100%);
	}
`;

export const DisplaySkinPaddle = styled.div`
	${({ $skin }) => $skin ? `background: url(${$skin})` : 'background: #fff'};
	width: 225px;
	height: 40px;
	border-radius: 20px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
	animation: ${movePaddle} 2s infinite;
`;

export const StyledCanvas = styled.canvas`
	width: 600px;
	height: 300px;
`;

export const BalanceContainer = styled.div`
	width: 90%;
	margin: 20px auto;

	& > p {
		font-size: 2.5rem;
		color: rgba(255, 255, 255, 0.9);

		& > i {
			margin-right: 10px;
			color: #ffdf00; /* Gold coin icon color */
		}
	}
`;

export const ActivityContainer = styled.div`
	grid-column: 1;
	grid-row: 2;
	width: 100%;
	margin: 0 auto;
	padding-top: 20px;

	& > h2 {
		color: rgba(255, 255, 255, 0.9);
	}
`;

export const BlockedProfileContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100vh;
	border: 1px solid transparent;
	background-color: #000;
	background-image: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.15), transparent 50%),
					  radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.1), transparent 50%),
					  radial-gradient(circle at 50% 80%, rgba(164, 69, 178, 0.1), transparent 50%),
					  linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
	background-size: cover;
	background-position: center;
`;
