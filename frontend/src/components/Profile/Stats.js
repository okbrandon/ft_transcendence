import React from "react";
import ReactApexChart from "react-apexcharts";
import { ChartContainer, DonutChartContainer } from "../../styles/Profile.styled";

const matchArrayTest = [
	{player1: "roger", player2: "bradon", winner: "bradon", score1: 20, score2: 21, won: true},
	{player1: "van", player2: "bradon", winner: "bradon", score1: 1, score2: 21, won: true},
	{player1: "min", player2: "bradon", winner: "bradon", score1: 19, score2: 21, won: true},
	{player1: "ian", player2: "bradon", winner: "ian", score1: 20, score2: 19, won: false},
	{player1: "roger", player2: "bradon", winner: "bradon", score1: 20, score2: 21, won: true},
	{player1: "van", player2: "bradon", winner: "bradon", score1: 1, score2: 21, won: true},
	{player1: "min", player2: "bradon", winner: "bradon", score1: 19, score2: 21, won: true},
	{player1: "ian", player2: "bradon", winner: "ian", score1: 20, score2: 19, won: false},
];

const Stats = () => {
	const series = [matchArrayTest.filter((match) => match.won).length, matchArrayTest.filter((match) => !match.won).length];
	const options = {
		dataLabels: { enabled: true, style: { fontSize: '15px' } },
		labels: ['Wins', 'Losses'],
		stroke: { width: 0 },
		legend: { show: false },
		fill: { colors: ['#8BD742', '#F74D52'] },
		tooltip: { enabled: false },
		plotOptions: {
			pie: {
				expandOnClick: false,
				donut: {
					size: '80%',
					labels: {
						show: true,
						name: {
							show: true,
							formatter: () => 'winrate',
						},
						value: {
							show: true,
							fontSize: '18px',
						},
						total: {
							show: true,
							showAlways: true,
							fontSize: '20px',
							color: '#ffffff',
							formatter: () => Math.round(series[0] / matchArrayTest.length * 100) + '%',
						}
					}
				}
			}
		}
	};

	return (
		<ChartContainer>
			<DonutChartContainer>
				<ReactApexChart
					options={options}
					series={series}
					type="donut"
				/>
			</DonutChartContainer>
			<DonutChartContainer>
				<ReactApexChart
					options={options}
					series={series}
					type="donut"
				/>
			</DonutChartContainer>
		</ChartContainer>
	);
};

export default Stats;
