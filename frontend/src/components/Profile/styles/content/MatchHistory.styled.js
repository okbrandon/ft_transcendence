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
		background: rgb(10,10,10);
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
		scrollbar-width: thin;
		scrollbar-color: rgba(100, 100, 100, 0.5) rgba(30, 30, 30, 0.8); /* Dark scrollbar for consistency */
	}

	& tbody::-webkit-scrollbar {
		width: 8px;
	}

	& tbody::-webkit-scrollbar-thumb {
		background-color: rgba(100, 100, 100, 0.5); /* Darker scrollbar thumb */
		border-radius: 10px;
	}

	& tbody::-webkit-scrollbar-track {
		background: rgba(30, 30, 30, 0.8); /* Darker scrollbar track */
	}

	& tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	& td {
		padding: 16px;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.85); /* Light grey for better readability */
	}

	& tbody > tr:nth-child(even) {
		background: linear-gradient(90deg, rgba(40, 40, 40, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%); /* Softer black gradients for even rows */
	}

	& tbody > tr:nth-child(odd) {
		background: linear-gradient(90deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 40, 40, 0.6) 100%); /* Softer black gradients for odd rows */
	}
`;
