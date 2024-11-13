import styled from "styled-components";

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
	height: 300px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-repeat: no-repeat;
	${props => props.$path ? `background-image: url(${props.$path});` : 'background-color: #111;'}
	background-size: cover;
	background-position: center;
`;

export const UserContainer = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 40px;
	width: 75%;
	margin: 40px auto;
	padding-bottom: 20px;
`;

export const UserMainInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 65%;
	gap: 30px;
`;

export const UserInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: fit-content;
	width: 35%;
	gap: 40px;
	border-radius: 12px;
	background-color: #0f0e17;
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
	padding: 40px;
`;

export const UserInfoItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 25px;
	width: 100%;
	padding: 35px;
	border-radius: 12px;
	background-color: #1e1e28;
	position: relative;
	border: 1px solid rgba(255, 255, 255, 0.08);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const UserInfoItemTitle = styled.h3`
	color: rgba(255, 255, 255, 0.95);
	letter-spacing: 0.05em;
`;

export const StyledCanvas = styled.canvas`
	width: 600px;
	height: 300px;
`;

export const BalanceContainer = styled.div`
	width: 100%;
	margin: 20px auto;
	display: flex;
	justify-content: center;
	align-items: center;

	& > p {
		font-size: 2.5rem;
		color: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;

		& > i {
			margin-right: 10px;
			color: #ffdf00;
			font-size: 2.5rem;
		}
	}
`;

export const ActivityContainer = styled.div`
	grid-column: 1;
	grid-row: 2;
	width: 100%;
	margin: 0 auto;
	padding-top: 20px;
`;

export const MatchHistoryContainer = styled.div`
	padding: 30px;
	background-color: #0f0e17;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	margin: 0 auto;
	overflow: hidden;

	h2 {
		font-size: 28px;
		font-weight: 600;
		margin-bottom: 25px;
		text-align: center;
		color: #e7e7e8;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	p {
		text-align: center;
		font-size: 18px;
		color: #888;
	}
`;

export const MatchCardTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	font-family: 'Arial', sans-serif;
	background-color: #0b0b12;
	border-radius: 10px;
	overflow: hidden;

	thead {
		background-color: #181823;
		color: white;
		text-transform: uppercase;
		font-size: 16px;
		font-weight: 600;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	th, td {
		padding: 20px;
		text-align: center;
		border-bottom: 1px solid #2e2e3d;
	}

	td.hover {
		&:hover {
			color: rgba(164, 69, 178, 1);
		}
	}

	tbody {
		display: block;
		max-height: 600px;
		overflow-y: auto;
		width: 100%;

		::-webkit-scrollbar {
			width: 10px;
		}

		::-webkit-scrollbar-thumb {
			background-color: #ff005c;
			border-radius: 10px;
		}

		::-webkit-scrollbar-track {
			background-color: #181823;
		}
	}

	thead, tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	tbody tr {
		background-color: #101018;
	}

	tbody tr.visible {
		background-color: #292933;
	}

	td {
		font-size: 18px;
		color: #b5b5c5;
	}

	td.profile {
		cursor: pointer;
	}

	th {
		font-size: 18px;
		color: #ccccdd;
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
