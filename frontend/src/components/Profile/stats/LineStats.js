import React from "react";
import { getNumberOfMatchesPerMonth } from "../scripts/match";
import { LineStatsContainer } from "../../../styles/Profile/Stats.styled";
import ReactApexChart from "react-apexcharts";

const LineStats = ({ matchArray }) => {
	const series = [{
		name: 'Parties played',
		data: getNumberOfMatchesPerMonth(matchArray),
	}];
	const options = {
		chart: {
			type: 'line',
			toolbar: { show: false },
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		title: {
			text: 'Matches played per month',
			align: 'left',
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		},
	}

	return (
		<LineStatsContainer>
			<ReactApexChart
				options={options}
				series={series}
				type='line'
			/>
		</LineStatsContainer>
	);
};

export default LineStats;
