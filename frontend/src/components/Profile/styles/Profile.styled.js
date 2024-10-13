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
	display: flex;
	justify-content: center;
	gap: 30px;
	width: 70%;
	margin-top: 30px;
`;

export const UserMainInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const UserInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: fit-content;
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

export const MatchHistoryContainer = styled.div`
	position: relative;

	& > h2 {
		font-size: 30px;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 20px;
		padding: 20px 0;
	}
`;

export const MatchCardTable = styled.table`
	margin: 0 auto;
	text-align: center;
	width: 100%;
	border-spacing: 0 10px;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	overflow: hidden;

	& thead {
		background: rgba(0, 0, 0, 0.8);
		position: absolute;
		top: 82px;
		left: 0;
		height: 90px;
		display: table;
		width: 100%;
		table-layout: fixed;
		z-index: 1;
	}

	& tbody {
		display: block;
		height: 610px;
		overflow-y: auto;
		width: 100%;
		margin-top: 75px;
	}

	& tbody tr {
		opacity: 0;
		transform: translateY(-10px);
		transition: opacity 1s ease-out, transform 1s ease-out;
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	& tbody tr.visible {
		opacity: 1;
		transform: translateY(0);
	}

	& td {
		padding: 16px;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.85);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	& tbody > tr:nth-child(even) {
		background: linear-gradient(90deg, rgba(40, 40, 40, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%);
	}

	& tbody > tr:nth-child(odd) {
		background: linear-gradient(90deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 40, 40, 0.6) 100%);
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
