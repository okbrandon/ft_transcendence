import React from "react";
import ReactApexChart from "react-apexcharts";
import { calculateTotalDefeats, calculateTotalWins } from "../../../scripts/match";
import { DonutStatsContainer } from "../styles/Stats.styled";
import { useTranslation } from "react-i18next";

const DonutStats = ({ matchArray }) => {
	const { t } = useTranslation();
	const series = [calculateTotalWins(matchArray), calculateTotalDefeats(matchArray)];
	const options = {
		dataLabels: { enabled: true, style: { fontSize: '15px' } },
		labels: [t('profile.stats.donut.labels.first'), t('profile.stats.donut.labels.second')],
		stroke: { width: 0 },
		legend: { show: false },
		fill: { colors: ['#8BD742', '#F74D52'] },
		tooltip: { enabled: true },
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
							formatter: () => Math.round(series[0] / matchArray.length * 100) + '%',
						}
					}
				}
			}
		}
	};

	return (
		<DonutStatsContainer>
			<ReactApexChart
				options={options}
				series={series}
				type="donut"
			/>
		</DonutStatsContainer>
	);
};

export default DonutStats;
