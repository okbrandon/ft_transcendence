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
	// Adjust the positionClass based on the rearranged positions
	const positionClass = position === 0 ? 'second' : position === 1 ? 'first' : 'third';
	const playerName = player?.name || 'N/A';
	const playerAvatar = player?.avatar || 'images/default-profile.png';
	const playerScore = player?.stats.gamesWon || 0;

	return (
		<PodiumBase className={positionClass}>
			<PlayerAvatar src={playerAvatar} alt={playerName} $position={positionClass} />
			<PlayerInfo $position={positionClass}>
				<PlayerName>{playerName}</PlayerName>
				<TrophyContainer $position={positionClass}>
					<Badge className={positionClass}><i className="bi bi-trophy-fill" /></Badge>
				</TrophyContainer>
				<Separator />
				<PlayerScore $position={positionClass}>{playerScore} points</PlayerScore>
			</PlayerInfo>
		</PodiumBase>
	);
};

export default PodiumPlayer;
