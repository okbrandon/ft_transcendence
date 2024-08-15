import styled from 'styled-components';

export const UserMainInfoLayout = styled.div`
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

export const UserMainInfoContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;
`;

export const MainInfoContainer = styled.div`
	display: flex;
	justify-content: center;
`;

export const MainInfoItem = styled.div`
	display: flex;
	min-width: 180px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;

	& .title {
		font-size: 18px;
		font-weight: 700;
	}

	& h2 {
		font-size: 23px;
	}
`;
