import styled from "styled-components";

export const AboutContainer = styled.div`
	grid-column: 1;
	grid-row: 2 / 4;
	background: rgba(5,5,5,0.8);
	margin-top: 50px;
	border-radius: 30px;
	border: 1px solid rgba(255,255,255,0.1);
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1), 0 0 15px rgba(164, 69, 178, 0.3);

	& > p {
		width: 508px;
		padding: 20px;
		word-wrap: break-word;
		font-family: 'Poppins', sans-serif;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.85);
	}
`;

export const BalanceContainer = styled.div`
	border-top: 1px solid rgba(255, 255, 255, 0.2);
	width: 90%;
	margin: 20px auto;
	padding-top: 10px;

	& > h3 {
		color: rgba(255, 255, 255, 0.7);
		font-size: 22px;
		padding-bottom: 10px;
	}

	& > p {
		font-size: 23px;
		color: rgba(255, 255, 255, 0.9);
		padding-top: 10px;

		& > i {
			margin-right: 10px;
			color: #ffdf00; /* Gold coin icon color */
		}
	}
`;

export const ActivityContainer = styled.div`
	border-top: 1px solid rgba(255, 255, 255, 0.2);
	width: 90%;
	margin: 0 auto;
	padding-top: 20px;

	& > h3 {
		color: rgba(255, 255, 255, 0.7);
		font-size: 22px;
	}
`;
