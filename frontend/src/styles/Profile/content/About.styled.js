import styled from "styled-components";

export const AboutContainer = styled.div`
	grid-column: 1;
	grid-row: 2 / 4;
	background: rgba(5,5,5,0.8);
	margin-top: 50px;
	border-radius: 30px;
	height: 730px;
	border: 1px solid rgba(255,255,255,0.1);

	& > p {
		width: 508px;
		padding: 15px;
		height: 200px;
		word-wrap: break-word;
		font-family: 'Poppins', sans-serif;
	}
`;

export const BalanceContainer = styled.div`
	border-top: 1px solid rgba(255,255,255,0.2);
	width: 90%;
	margin: 0 auto;

	& > h3 {
		color: rgba(255,255,255,0.2);
		font-size: 20px;
		padding-top: 10px;
	}

	& > p {
		padding-top: 10px;
		font-size: 23px;

		& > i {
			margin-right: 10px;
		}
	}
`;

export const ActivityContainer = styled.div`
	border-top: 1px solid rgba(255,255,255,0.2);
	width: 90%;
	margin: 0 auto;

	& > h3 {
		color: rgba(255,255,255,0.2);
		font-size: 20px;
		padding-top: 10px;
	}
`;
