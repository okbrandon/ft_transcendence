import styled from "styled-components";

export const MatchHistoryContainer = styled.div`
	grid-column: 1 / 2;
	margin: 30px 0;
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
