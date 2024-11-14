import React from "react";
import ReactApexChart from 'react-apexcharts';
import { LineStatsContainer } from "../../Profile/styles/Stats.styled";

const TournamentStats = ({ totalScores }) => {
	const series = [{
		name: 'Scores',
		data: Object.values(totalScores),
	}];
	const categories = Object.keys(totalScores);
	const options = {
		chart: {
			type: 'line',
			toolbar: { show: false },
			background: '#0a0a13',
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		title: {
			text: 'Total points', // Brandon to be translated
			align: 'left',
			style: {
				color: '#ffffff',
			},
		},
		xaxis: {
			categories,
			labels: {
				style: {
					colors: '#ffffff',
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: '#ffffff',
				},
			},
			forceNiceScale: true,
		},
		colors: ['#ff005c'],
		grid: {
			borderColor: '#2e2e3d',
		},
		tooltip: {
			theme: 'dark'
		}
	};

	return (
		<LineStatsContainer id="linestats" style={{height: '450px', width: '90%'}}>
			<ReactApexChart
				options={options}
				series={series}
				type="line"
				height="100%"
			/>
		</LineStatsContainer>
	)
}

export default TournamentStats;
