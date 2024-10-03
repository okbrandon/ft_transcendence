import React from 'react';
import {
	PodiumContainer,
	FirstPlace,
	SecondPlace,
	ThirdPlace,
	PlayerInfo,
	PlayerName,
	PlayerScore,
	PlayerPrize,
	PlayerAvatar,
	PodiumPosition,
	PodiumImg,
} from './styles/Podium.styled';

const Podium = ({ leaderboardData }) => {
	const topThree = leaderboardData.slice(0, 3);

	return (
		<PodiumContainer>
			<SecondPlace>
				<PlayerAvatar src={topThree[1]?.avatar} alt={topThree[1]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[1]?.name || 'N/A'}</PlayerName>
					<PlayerScore>{topThree[1]?.stats.gamesWon || 0} points</PlayerScore>
					<PlayerPrize>{topThree[1]?.prize || 2500} Prize</PlayerPrize>
				</PlayerInfo>
				<PodiumPosition>2nd</PodiumPosition>
			</SecondPlace>

			<FirstPlace>
				<PlayerAvatar src={topThree[0]?.avatar} alt={topThree[0]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[0]?.name || 'N/A'}</PlayerName>
					<PlayerScore>{topThree[0]?.stats.gamesWon || 0} points</PlayerScore>
					<PlayerPrize>{topThree[0]?.prize || 5000} Prize</PlayerPrize>
				</PlayerInfo>
				<PodiumPosition>1st</PodiumPosition>
			</FirstPlace>

			<ThirdPlace>
				<PlayerAvatar src={topThree[2]?.avatar} alt={topThree[2]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[2]?.name || 'N/A'}</PlayerName>
					<PlayerScore>{topThree[2]?.stats.gamesWon || 0} points</PlayerScore>
					<PlayerPrize>{topThree[2]?.prize || 1500} Prize</PlayerPrize>
				</PlayerInfo>
				<PodiumPosition>3rd</PodiumPosition>
			</ThirdPlace>
		</PodiumContainer>
	);
};

export default Podium;
