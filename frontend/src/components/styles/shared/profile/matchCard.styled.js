import styled from 'styled-components';

const MatchCard = styled.table`
	width: 100%;

	& td {
		width: calc(100% / 3);
		text-align: center;
		vertical-align: middle;
	}
`;

export default MatchCard;
