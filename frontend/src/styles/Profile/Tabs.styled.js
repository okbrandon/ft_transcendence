import styled from "styled-components";
import Tabs from 'react-bootstrap/Tabs';

export const ProfileTabs = styled(Tabs)`
	--bs-nav-link-color: #fff;
	--bs-nav-link-hover-color: #fff;
	background: #000;
	padding-left: 20%;

	& .nav-link {
		font-size: 18px;
		padding: 7px 20px;
	}
`;

export const MatchCardTable = styled.table`
	width: 60%;
	margin: 30px auto 0 auto;
	border-collapse: collapse;
	text-align: center;

	& thead {
		background: transparent;
		font-size: 18px;
	}

	& th {
		padding: 30px;
	}

	& td {
		padding: 16px;
		font-size: 18px;
	}

	& tbody > tr:nth-child(even) {
		background: #181635;
	}

	& tbody > tr:nth-child(odd) {
		background: #15132f;
	}
`;

export const ChartContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 600px;
`;

export const DonutChartContainer = styled.div`
	width: 500px;
	height: 500px;
`;

export const Pagination = styled.div`
	position: absolute;
	bottom: 0;
	left: 20%;
	border: 1px solid white;
	display: flex;
	justify-content: center;
	width: 60%;
	margin: 0 auto;

	& button {
		color: #fff;
		width: 30px;
		background: #5b56a7;
	}
`;
