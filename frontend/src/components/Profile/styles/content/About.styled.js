import styled from "styled-components";

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
