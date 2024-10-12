import styled from "styled-components";

export const DonutStatsContainer = styled.div`
	width: 220px;
	margin-top: 20px;
`;

export const LineStatsContainer = styled.div`
	margin-top: 20px;
	color: #000;
`;

export const WinrateContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const WinrateCard = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	& > h3 {
		color: rgba(255, 255, 255, 0.8);
		font-size: 20px;
		margin-bottom: 15px;
	}
`;
