import styled from "styled-components";

export const DonutStatsContainer = styled.div`
	width: 320px;
	margin: 20px auto;
`;

export const LineStatsContainer = styled.div`
	width: 100%;
	margin: 20px auto;
	color: #000;
`;

export const WinrateContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px 0;
	gap: 20px;
`;

export const WinrateCard = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 15px;
	width: 250px;

	& > h3 {
		color: rgba(255, 255, 255, 0.8);
		font-size: 20px;
		margin-bottom: 15px;
	}
`;
