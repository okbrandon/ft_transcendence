import styled from 'styled-components';

export const MainBarLayout = styled.div`
	grid-column: 1 / 4;
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	height: 180px;
	background: rgba(0,0,0,0.8);
	backdrop-filter: blur(10px);
	border-radius: 30px;
	border: 1px solid rgba(255,255,255,0.1);
`;

export const MainBarContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;

	& > i {
		margin-right: 50px;
		font-size: 40px;
		color: #fff;
		cursor: pointer;
	}
`;

export const MainStatsContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-left: 50px;
`;

export const MainStatsItem = styled.div`
	display: flex;
	min-width: 180px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;

	& > h2 {
		font-size: 1.2rem;
		font-weight: 700;
		color: rgb(150,150,150);
	}

	& p {
		font-size: 1.5rem;
	}
`;
