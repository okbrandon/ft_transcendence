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

export const SectionContainer = styled.div`
	grid-column: 2 / 4;
	grid-row: 2;
	background: rgba(5, 5, 5, 0.9);
	margin: 50px 0 0 30px;
	border-radius: 20px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1), 0 0 15px rgba(164, 69, 178, 0.4);
	padding: 30px;
`;

export const WinrateContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 60px;
	padding: 20px 0;
`;

export const WinrateCard = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 15px;
	width: 300px;

	& > h3 {
		color: rgba(255, 255, 255, 0.8);
		font-size: 20px;
		margin-bottom: 15px;
	}
`;
