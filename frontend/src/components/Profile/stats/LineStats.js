import React from "react";
import ReactApexChart from "react-apexcharts";
import { getNumberOfMatchesPerMonth } from "../../../scripts/match";
import { LineStatsContainer } from "../styles/Stats.styled";
import { useTranslation } from "react-i18next";

const LineStats = ({ matches }) => {
	const { t } = useTranslation();
	const series = [{
		name: t('profile.stats.line.title'),
		data: getNumberOfMatchesPerMonth(matches),
	}];
	const months = [
		'january', 'february', 'march', 'april', 'may', 'june',
		'july', 'august', 'september', 'october', 'november', 'december'
	];
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
			text: t('profile.stats.line.subTitle'),
			align: 'left',
			style: {
				color: '#ffffff',
			},
		},
		xaxis: {
			categories: months.map(month => t(`profile.stats.line.categories.months.${month}`)),
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
		<LineStatsContainer>
			<ReactApexChart
				options={options}
				series={series}
				type='line'
				height={300}
			/>
		</LineStatsContainer>
	);
};

export default LineStats;
