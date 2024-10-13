import React from 'react';
import { PodiumContainer } from './styles/Podium.styled';
import PodiumPlayer from './tools/PodiumPlayer';

const Podium = ({ leaderboardData }) => {
    const topThree = leaderboardData.slice(0, 3);

    return (
        <PodiumContainer>
            {topThree.map((player, index) => (
                <PodiumPlayer key={index} player={player} position={index} />
            ))}
        </PodiumContainer>
    );
};

export default Podium;
