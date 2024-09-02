import styled from "styled-components";

export const MatchHistoryContainer = styled.div`
	grid-column: 2 / 4;
	grid-row: 3 / 6;
	margin: 30px 0 30px 30px;
	background: rgba(5,5,5,0.8);
	border-radius: 30px;
	height: 795px;
	padding: 0 0 50px 0;
	border: 1px solid rgba(255,255,255,0.1);
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1), 0 0 15px rgba(164, 69, 178, 0.3);
	position: relative;

	& > h2 {
		position: absolute;
		top: 0;
	}
`;

export const MatchCardTable = styled.table`
	margin: 0 auto;
	text-align: center;
	width: 98%;

	& thead {
		background: #000;
		position: absolute;
		top: 77px;
		left: 0;
		height: 90px;
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	& tbody {
		display: block;
		max-height: 610px;
		overflow-y: scroll;
		width: 100%;
		margin-top: 167px;
	}

	& tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
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
