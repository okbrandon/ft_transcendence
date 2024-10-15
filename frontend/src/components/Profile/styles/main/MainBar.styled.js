import styled from 'styled-components';

export const MainBarContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	width: 80%;
	height: 180px;
	background: #0f0e17;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;

	i {
		font-size: 40px;
		color: #fff;
		cursor: pointer;
	}

	& > p {
		max-width: 500px;
		max-height: 180px;
		word-wrap: break-word;
		margin-right: 50px;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.9);
	}
`;

export const MainStatsContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-left: 50px;
`;

export const MainStatsItem = styled.div`
	display: flex;
	min-width: 180px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;

	& > h2 {
		font-size: 1.2rem;
		font-weight: 700;
		color: rgb(150,150,150);
	}

	& p {
		font-size: 1.5rem;
	}
`;
