import React from 'react';
import {
	PodiumContainer,
	FirstPlace,
	SecondPlace,
	ThirdPlace,
	PlayerInfo,
	PlayerName,
	PlayerScore,
	PlayerAvatar,
	TrophyContainer,
	FirstPosition,
	SecondPosition,
	ThirdPosition,
} from './styles/Podium.styled';

const Podium = ({ leaderboardData }) => {
	const topThree = leaderboardData.slice(0, 3);

	return (
		<PodiumContainer>
			<SecondPlace>
				<PlayerAvatar src={topThree[1]?.avatar} alt={topThree[1]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[1]?.name || 'N/A'}</PlayerName>
					<TrophyContainer>
						<SecondPosition><i className="bi bi-trophy-fill" /></SecondPosition>
					</TrophyContainer>
					<PlayerScore>{topThree[1]?.stats.gamesWon || 0} points</PlayerScore>
				</PlayerInfo>
			</SecondPlace>

			<FirstPlace>
				<PlayerAvatar src={topThree[0]?.avatar} alt={topThree[0]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[0]?.name || 'N/A'}</PlayerName>
					<TrophyContainer>
						<FirstPosition><i className="bi bi-trophy-fill" /></FirstPosition>
					</TrophyContainer>
					<PlayerScore>{topThree[0]?.stats.gamesWon || 0} points</PlayerScore>
				</PlayerInfo>
			</FirstPlace>

			<ThirdPlace>
				<PlayerAvatar src={topThree[2]?.avatar} alt={topThree[2]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[2]?.name || 'N/A'}</PlayerName>
					<TrophyContainer>
						<ThirdPosition><i className="bi bi-trophy-fill" /></ThirdPosition>
					</TrophyContainer>
					<PlayerScore>{topThree[2]?.stats.gamesWon || 0} points</PlayerScore>
				</PlayerInfo>
			</ThirdPlace>
		</PodiumContainer>
	);
};

export default Podium;
