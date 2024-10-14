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
import { GetUsers } from '../../../api/user';

const PodiumPlayer = ({ player, position, selectedStat }) => {
	const [avatar, setAvatar] = useState('images/default-profile.png'); // Default avatar
	const positionClass = position === 0 ? 'second' : position === 1 ? 'first' : 'third';
	const playerName = player?.name || 'N/A';
	const playerScore = player?.stats[selectedStat] || 0;

	useEffect(() => {
		const fetchUserAvatar = async () => {
			try {
				const users = await GetUsers();
				const matchedUser = users.find(user => user.id === player.userID);
				if (matchedUser) {
					setAvatar(matchedUser.avatar);
				}
			} catch (error) {
				console.error('Error fetching user avatar:', error);
			}
		};

		fetchUserAvatar();
	}, [player.userID]);

	return (
		<PodiumBase className={positionClass}>
			<PlayerAvatar src={avatar} alt={playerName} $position={positionClass} />
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
