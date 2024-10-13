import React from 'react';
import {
	PlayerInfo,
	PlayerName,
	PlayerScore,
	PlayerAvatar,
	TrophyContainer,
	Separator,
	PodiumBase,
	Badge,
} from '../styles/Podium.styled';

const PodiumPlayer = ({ player, position }) => {
	const positionClass = position === 0 ? 'first' : position === 1 ? 'second' : 'third';
	const playerName = player?.name || 'N/A';
	const playerAvatar = player?.avatar || 'images/default-profile.png';
	const playerScore = player?.stats.gamesWon || 0;

	return (
		<PodiumBase className={positionClass}>
			<PlayerAvatar src={playerAvatar} alt={playerName} />
			<PlayerInfo>
				<PlayerName>{playerName}</PlayerName>
				<TrophyContainer>
					<Badge className={positionClass}><i className="bi bi-trophy-fill" /></Badge>
				</TrophyContainer>
				<PlayerScore>{playerScore} points</PlayerScore>
				<Separator />
			</PlayerInfo>
		</PodiumBase>
	);
};

export default PodiumPlayer;
