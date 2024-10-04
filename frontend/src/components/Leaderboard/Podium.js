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
	Firstposition,
	Thirdposition,
	Secondposition,
} from './styles/Podium.styled';

const Podium = ({ leaderboardData }) => {
	const topThree = leaderboardData.slice(0, 3);

	return (
		<PodiumContainer>
			<SecondPlace>
				<Secondposition><i className="bi bi-trophy-fill" /></Secondposition>
				<PlayerAvatar src={topThree[1]?.avatar} alt={topThree[1]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[1]?.name || 'N/A'}</PlayerName>
					<PlayerScore>{topThree[1]?.stats.gamesWon || 0} points</PlayerScore>
				</PlayerInfo>
			</SecondPlace>

			<FirstPlace>
				<Firstposition><i className="bi bi-trophy-fill" /></Firstposition>
				<PlayerAvatar src={topThree[0]?.avatar} alt={topThree[0]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[0]?.name || 'N/A'}</PlayerName>
					<PlayerScore>{topThree[0]?.stats.gamesWon || 0} points</PlayerScore>
				</PlayerInfo>
			</FirstPlace>

			<ThirdPlace>
				<Thirdposition><i className="bi bi-trophy-fill" /></Thirdposition>
				<PlayerAvatar src={topThree[2]?.avatar} alt={topThree[2]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[2]?.name || 'N/A'}</PlayerName>
					<PlayerScore>{topThree[2]?.stats.gamesWon || 0} points</PlayerScore>
				</PlayerInfo>
			</ThirdPlace>
		</PodiumContainer>
	);
};

export default Podium;
