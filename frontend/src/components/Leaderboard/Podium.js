import React from 'react';
import {
	PodiumContainer,
	PlayerInfo,
	PlayerName,
	PlayerScore,
	PlayerAvatar,
	TrophyContainer,
	Separator,
	PodiumBase,
	Badge,
} from './styles/Podium.styled';

const Podium = ({ leaderboardData }) => {
	const topThree = leaderboardData.slice(0, 3);
	const podiumOrder = [1, 0, 2];

	return (
		<PodiumContainer>
			<PodiumBase className='second'>
				<PlayerAvatar src={topThree[1]?.avatar || 'images/default-profile.png'} alt={topThree[1]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[1]?.name || 'N/A'}</PlayerName>
					<TrophyContainer>
						<Badge className='second'><i className="bi bi-trophy-fill" /></Badge>
					</TrophyContainer>
					<PlayerScore>{topThree[1]?.stats.gamesWon || 0} points</PlayerScore>
					<Separator />
				</PlayerInfo>
			</PodiumBase>

			<PodiumBase className='first'>
				<PlayerAvatar src={topThree[0]?.avatar || 'images/default-profile.png'} alt={topThree[0]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[0]?.name || 'N/A'}</PlayerName>
					<TrophyContainer>
						<Badge className='first'><i className="bi bi-trophy-fill" /></Badge>
					</TrophyContainer>
					<PlayerScore>{topThree[0]?.stats.gamesWon || 0} points</PlayerScore>
					<Separator />
				</PlayerInfo>
			</PodiumBase>

			<PodiumBase className='third'>
				<PlayerAvatar src={topThree[2]?.avatar || 'images/default-profile.png'} alt={topThree[2]?.name || 'N/A'} />
				<PlayerInfo>
					<PlayerName>{topThree[2]?.name || 'N/A'}</PlayerName>
					<TrophyContainer>
						<Badge className='third'><i className="bi bi-trophy-fill" /></Badge>
					</TrophyContainer>
					<PlayerScore>{topThree[2]?.stats.gamesWon || 0} points</PlayerScore>
					<Separator />
				</PlayerInfo>
			</PodiumBase>
		</PodiumContainer>
	);
};

export default Podium;
