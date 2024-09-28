import React from 'react';

import cat from './img/GingerCat.jpg';
import spacebanner from './img/spacebanner.jpg';
import UserStats from './tools/UserStats';
import {
	PlayerCardContainer,
	PlayerBannerContainer,
	PlayerBannerImg,
	PlayerProfileContainer,
	PlayerProfileImg,
	PlayerIDContainer,
	PlayerName,
	PlayerStatsContainer,
} from './styles/PlayerCard.styled';

const PlayerProfileName = ({ playerID }) => {
	return (
		<PlayerIDContainer>
			<PlayerName>{playerID}</PlayerName>
		</PlayerIDContainer>
	);
};

const PlayerCard = ({ playerID }) => {
	return (
		<PlayerCardContainer>
			<PlayerBannerContainer>
				<PlayerBannerImg src={spacebanner} alt="banner" />
			</PlayerBannerContainer>
			<PlayerProfileContainer>
				<PlayerProfileImg src={cat} alt="player" />
				<PlayerProfileName playerID={playerID} />
			</PlayerProfileContainer>
			<PlayerStatsContainer>
				<UserStats score={'90'} position={'2nd'}/>
			</PlayerStatsContainer>
		</PlayerCardContainer>
	);
};

export default PlayerCard;
