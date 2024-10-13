import React from 'react';
import { PodiumContainer } from './styles/Podium.styled';
import PodiumPlayer from './tools/PodiumPlayer';

const Podium = ({ leaderboardData }) => {
	const topThree = leaderboardData.slice(0, 3);

	// Rearrange the order: second player first, then first, then third
	const rearrangedTopThree = [topThree[1], topThree[0], topThree[2]];

	console.log('rearrangedTopThree:', rearrangedTopThree);

	return (
		<PodiumContainer>
			{rearrangedTopThree.map((player, index) => (
				<PodiumPlayer key={index} player={player} position={index} />
			))}
		</PodiumContainer>
	);
};

export default Podium;
