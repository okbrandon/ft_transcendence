import React, { useEffect, useState } from 'react';
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

const PodiumPlayer = ({ player, position, selectedStat }) => {
	const positionClass = position === 0 ? 'second' : position === 1 ? 'first' : 'third';
	const playerName = player?.user.username || 'N/A';
	const playerScore = player?.stats[selectedStat] || 0;

	return (
		<PodiumBase className={positionClass}>
			<PlayerAvatar src={player?.user.avatarID ? player?.user.avatarID : 'images/default-profile.png'} alt={playerName} $position={positionClass} />
			<PlayerInfo $position={positionClass}>
				<PlayerName>{playerName}</PlayerName>
				<TrophyContainer $position={positionClass}>
					<Badge className={positionClass}><i className="bi bi-trophy-fill" /></Badge>
				</TrophyContainer>
				<PlayerScore $position={positionClass}>{selectedStat.replace('games', '')}</PlayerScore>
				<Separator />
				<PlayerScore $position={positionClass}>{playerScore}</PlayerScore>
			</PlayerInfo>
		</PodiumBase>
	);
};

export default PodiumPlayer;
