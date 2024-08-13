import styled from "styled-components";
import Tabs from 'react-bootstrap/Tabs';

export const ProfileContainer = styled.div`
	width: 100%;
	height: 100vh;
`;

export const ProfileBanner = styled.div`
	width: 100%;
	height: 250px;
	--s: 200px;
	--c1: #000;
	--c2: #0c0b1b;

	--_g: var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%,
		var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%,
		var(--c1) 76% 86%, var(--c2) 86% 96%;
	background: radial-gradient(
			100% 100% at 100% 0,
			var(--c1) 4%,
			var(--_g),
			#0008 96%,
			#0000
		),
		radial-gradient(
			100% 100% at 0 100%,
			#0000,
			#0008 4%,
			var(--_g),
			var(--c1) 96%
		)
		var(--c1);
	background-size: var(--s) var(--s);
`;

export const ProfileContentContainer = styled.div`
	display: flex;
	position: relative;
	width: 100%;
`;

export const TabsContainer = styled.div`
	width: 1000px;
`;

export const ProfileTabs = styled(Tabs)`
	--bs-nav-link-color: #fff;
	--bs-nav-link-hover-color: #fff;

	& .nav-link {
		font-size: 20px;
	}
`;

export const MatchCardTable = styled.table`
	margin-top: 30px;
	width: 100%;
	border-collapse: collapse;
	text-align: center;

	& thead {
		background: #0f0f0f;
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
		background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(201,201,201,1) 100%);
	}

	& tbody > tr:nth-child(odd) {
		background: linear-gradient(90deg, rgba(201,201,201,1) 0%, rgba(0,0,0,1) 100%);
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
