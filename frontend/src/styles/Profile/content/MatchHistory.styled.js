import styled from "styled-components";

export const MatchHistoryContainer = styled.div`
	grid-column: 2 / 4;
	grid-row: 3;
	margin: 30px 0 0 30px;
	background: rgba(0,0,0,0.8);
	border-radius: 30px;
	height: 800px;
	overflow-y: scroll;
	padding: 0 0 50px 0;
	border: 1px solid rgba(255,255,255,0.1);

	& > h2 {
		position: sticky;
		top: 0;
	}
`;

export const MatchCardTable = styled.table`
	margin: 0 auto;
	border-collapse: collapse;
	text-align: center;
	width: 90%;

	& thead {
		background: #000;
		position: sticky;
		top: 77px;
		height: 90px;
	}

	& td {
		padding: 16px;
		font-size: 18px;
	}

	& tbody > tr:nth-child(even) {
		background: linear-gradient(90deg, rgba(50,50,50,0.8) 0%, rgba(0,0,0,0.5) 100%);
	}

	& tbody > tr:nth-child(odd) {
		background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(50,50,50,0.5) 100%);
	}
`;
