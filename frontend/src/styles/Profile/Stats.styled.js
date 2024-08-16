import styled from "styled-components";

export const DonutStatsContainer = styled.div`
	width: 320px;
	margin: 20px auto 0 auto;
`;

export const LineStatsContainer = styled.div`
	width: 420px;
	margin: 20px auto 0 auto;
	color: #000;
`;

export const WinrateLayout = styled.div`
	grid-column: 2 / 4;
	grid-row: 2;
	background: rgba(0,0,0,0.8);
	margin: 50px 0 0 30px;
	border-radius: 30px;
	border: 1px solid rgba(255,255,255,0.1);
`;

export const WinrateContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 80px;
`;

export const WinrateCard = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 20px 0;

	& > h3 {
		color: rgba(255,255,255,0.2);
		font-size: 20px;
	}
`;