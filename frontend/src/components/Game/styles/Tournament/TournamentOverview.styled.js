import styled from 'styled-components';

export const TournamentOverviewContainer = styled.div`
	padding: 30px;
	background-color: #0f0e17;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	margin: 0 auto;
	overflow: hidden;

	h2 {
		font-size: 28px;
		font-weight: 600;
		margin-bottom: 25px;
		text-align: center;
		color: #e7e7e8;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	p {
		text-align: center;
		font-size: 18px;
		color: #888;
	}
`;

export const TournamentTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	background-color: #0b0b12;
	border-radius: 10px;
	overflow: hidden;

	thead {
		background-color: #181823;
		color: white;
		text-transform: uppercase;
		font-size: 16px;
		font-weight: 600;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	th, td {
		padding: 20px;
		text-align: center;
		border-bottom: 1px solid #2e2e3d;
	}

	td.hover {
		&:hover {
			color: rgba(164, 69, 178, 1);
		}
	}

	tbody {
		display: block;
		max-height: 600px;
		overflow-y: auto;
		width: 100%;

		::-webkit-scrollbar {
			width: 10px;
		}

		::-webkit-scrollbar-thumb {
			background-color: #ff005c;
			border-radius: 10px;
		}

		::-webkit-scrollbar-track {
			background-color: #181823;
		}
	}

	thead, tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	tbody tr {
		background-color: #101018;
	}

	tbody tr.visible {
		background-color: #292933;
	}

	td {
		font-size: 18px;
		color: #b5b5c5;
	}

	td.profile {
		cursor: pointer;
	}

	th {
		font-size: 18px;
		color: #ccccdd;
	}
`;
