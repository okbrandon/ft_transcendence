import React from "react";
import { getNumberOfMatchesPerMonth } from "../scripts/match";

const LineStats = ({ matchArray }) => {
	const series = [{
		name: 'Parties played',
		data: getNumberOfMatchesPerMonth(matchArray),
	}];
	const options = {
		chart: {
			height: 350,
			type: 'line',
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		},
	}

	return (
		
	);
};

export default LineStats;
