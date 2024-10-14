import styled from 'styled-components';

export const ScoreTableStyled = styled.table`
	width: 100%;
	border-collapse: collapse;
	border-spacing: 0;
	color: #fff;
	font-size: 18px;

	& thead {
		background: rgb(10, 10, 10);
		height: 60px;
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	& tbody {
		display: block;
		height: 500px;
		overflow-y: auto;
		width: 100%;
		margin-top: 5px;
	}

	& tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	& th, & td {
		padding: 16px;
		color: rgba(255, 255, 255, 0.85);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 16px;
		text-align: left;
	}

	& th:nth-child(1), & td:nth-child(1) {
		width: 10%;
	}

	& th:nth-child(2), & td:nth-child(2) {
		width: 45%;
	}

	& th:nth-child(3), & td:nth-child(3) {
		width: 45%;
	}

	& tbody > tr:nth-child(even) {
		background: linear-gradient(90deg, rgba(40, 40, 40, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%);
	}

	& tbody > tr:nth-child(odd) {
		background: linear-gradient(90deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 40, 40, 0.6) 100%);
	}
`;
