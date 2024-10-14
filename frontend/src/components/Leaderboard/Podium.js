import React from 'react';
import { PodiumContainer } from './styles/Podium.styled';
import PodiumPlayer from './tools/PodiumPlayer';

const Podium = ({ leaderboardData, selectedStat }) => {
	const topThree = leaderboardData.slice(0, 3);

	const rearrangedTopThree = [topThree[1], topThree[0], topThree[2]];

	return (
		<PodiumContainer>
			{rearrangedTopThree.map((player, index) => (
				<PodiumPlayer key={index} player={player} position={index} selectedStat={selectedStat} />
			))}
		</PodiumContainer>
	);
};

export default Podium;
