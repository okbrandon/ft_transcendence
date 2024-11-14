import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Username } from '../styles/ScoreTable.styled';
import {
	PlayerInfo,
	PlayerScore,
	PlayerAvatar,
	TrophyContainer,
	Separator,
	PodiumBase,
	Badge,
} from '../styles/Podium.styled';
import { formatUserData } from '../../../api/user';

const PodiumPlayer = ({ player, position, selectedStat }) => {
	const navigate = useNavigate();
	const positionClass = position === 0 ? 'second' : position === 1 ? 'first' : 'third';
	const formattedPlayer = player ? formatUserData(player.user) : { displayName: 'N/A' };
	const playerScore = player?.stats[selectedStat] || 0;

	const handleClickUsername = (username) => {
		navigate(`/profile/${username}`);
	}

	return (
		<PodiumBase className={positionClass}>
			<PlayerAvatar src={formattedPlayer.avatarID ? formattedPlayer.avatarID : 'images/default-profile.webp'} alt={formattedPlayer.displayName} $position={positionClass} />
			<PlayerInfo $position={positionClass}>
				<div style={{paddingTop: '10px', fontWeight: 'bold'}}>
					{formattedPlayer.displayName !== 'N/A' ? (
						<Username onClick={() => handleClickUsername(formattedPlayer.username)}>{formattedPlayer.displayName}</Username>
					) : (
						<span style={{color: 'rgba(255, 255, 255, 0.5)', cursor: 'not-allowed'}}>N/A</span>
					)}
				</div>
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
