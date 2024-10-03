import React from "react";
import ReactApexChart from "react-apexcharts";
import { getNumberOfMatchesPerMonth } from "../../../scripts/match";
import { LineStatsContainer } from "../styles/Stats.styled";
import { useTranslation } from "react-i18next";

const LineStats = ({ matchArray }) => {
	const { t } = useTranslation();
	const series = [{
		name: t('profile.stats.line.title'),
		data: getNumberOfMatchesPerMonth(matchArray),
	}];
	const months = [
		'january', 'february', 'march', 'april', 'may', 'june',
		'july', 'august', 'september', 'october', 'november', 'december'
	];
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
			text: t('profile.stats.line.subTitle'),
			align: 'left',
		},
		xaxis: {
			categories: months.map(month => t(`profile.stats.line.categories.months.${month}`)),
		},
		colors: ['#fff'],
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
