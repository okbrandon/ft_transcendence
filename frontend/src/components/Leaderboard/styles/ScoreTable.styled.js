import styled from 'styled-components';

export const ScoreTableStyled = styled.table`
	border-collapse: collapse;
	width: 100%;
	margin-top: 20px;
	border-radius: 1em;
	overflow: hidden;

	th, td {
		border: 1px solid #bcbcbc;
		padding: 8px;
		text-align: center;
	}

	th {
		background-color: grey;
		color: white;
		text-align: center;
	}
`;
