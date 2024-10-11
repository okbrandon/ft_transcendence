import styled from 'styled-components';

export const SectionContainer = styled.div`
	grid-column: 1 / 3;
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	height: 180px;
	background: rgba(0, 0, 0, 0.8);
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
`;

export const MainBarContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;

	i {
		font-size: 40px;
		color: #fff;
		cursor: pointer;
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

export const IconsContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 40px;
	margin-right: 50px;
`;

export const IconButton = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(255, 255, 255, 0.1);
	padding: 15px 25px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);

	&:hover {
		background-color: rgba(164, 69, 178, 0.2);
		border-color: rgba(164, 69, 178, 0.5);
		box-shadow: 0 4px 15px rgba(164, 69, 178, 0.3), 0 0 10px rgba(255, 255, 255, 0.3);
	}

	i {
		font-size: 35px;
		color: rgba(255, 255, 255, 0.9);
	}

	&:disabled {
		background: rgba(100, 100, 100, 0.3);
		border-color: rgba(100, 100, 100, 0.5);
		color: rgba(200, 200, 200, 0.5);
		box-shadow: none;

		i {
			color: rgba(200, 200, 200, 0.5);
		}

		&:hover {
			background: rgba(100, 100, 100, 0.3);
			border-color: rgba(100, 100, 100, 0.5);
			box-shadow: none;
			color: rgba(200, 200, 200, 0.5);
		}
	}
`;
