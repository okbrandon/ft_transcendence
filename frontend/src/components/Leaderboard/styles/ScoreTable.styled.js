import styled from 'styled-components';

export const ScoreTableStyled = styled.table`
	width: 100%;
	border-collapse: separate;
	border-spacing: 0 5px;
	color: #fff;
	font-size: 16px;

	thead {
		background: rgba(10, 10, 10, 0.9);
		position: sticky;
		top: 0;
		z-index: 1;
	}

	tbody {
		display: block;
		height: 500px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgba(255, 255, 255, 0.3);
			border-radius: 3px;
		}
	}

	tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	th, td {
		padding: 16px;
		text-align: left;
		transition: background-color 0.3s ease;
	}

	th {
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	td {
		background-color: rgba(30, 30, 30, 0.7);
	}

	tr:hover td {
		background-color: rgba(50, 50, 50, 0.8);
	}

	th:nth-child(1), td:nth-child(1) { width: 10%; }
	th:nth-child(2), td:nth-child(2) { width: 45%; }
	th:nth-child(3), td:nth-child(3) { width: 45%; }
`;

export const Trophy = styled.i`
	color: ${props => {
		if (props.$position === 1) return '#ffd700';
		if (props.$position === 2) return '#c0c0c0';
		if (props.$position === 3) return '#cd7f32';
		return 'white';
	}};
	margin-right: 8px;
`;

export const Username = styled.span`
	cursor: pointer;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 2px;
		bottom: -2px;
		left: 0;
		background-color: #6a0dad;
		transform: scaleX(0);
		transform-origin: bottom left;
		transition: transform 0.3s ease;
	}

	&:hover::after {
		transform: scaleX(1);
	}

	&:hover {
		color: #6a0dad;
		transition: color 0.3s ease;
	}
`;
