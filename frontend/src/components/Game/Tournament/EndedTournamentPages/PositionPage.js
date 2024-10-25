import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';

const Position = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

const Layout = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 50px;
`;

const TournamentPodium = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	background-image: url('/images/podium.png');
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	width: 150px;
	height: 200px;
`;

const PlayerInfo = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	color: #fff;
	position: relative;
`;

const PlayerAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 25%;
	border: 3px solid #3f3f3f;
	box-shadow: 0 0 100px rgba(255, 255, 255, 0.7);
	position: relative;
	object-fit: cover;
	${props => props.$top ? 'top: -80px;' : ''}
`;

const PlayerName = styled.div`
	font-size: 1.2em;
`;

const TrophyContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

export const Separator = styled.hr`
	width: 100%;
	border: 0.5px solid #ccc;
	margin: 10px 0;
	box-sizing: border-box;
	position: relative;
`;

export const Badge = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	width: 40px;
	height: 30px;

	&.first {
		background-color: #ffd700;
	}

	&.second {
		background-color: #c0c0c0;
	}

	&.third {
		background-color: #cd7f32;
	}
`;

const UserRewards = styled.p`
	font-size: 1rem;
	color: #888;
	margin-bottom: 10px;
`;

const ElementContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const PositionPage = () => {
	const [userPosition, setUserPosition] = useState(1);
	const [userRewards, setUserRewards] = useState(42);
	const [userDetails, setUserDetails] = useState({
		avatar: '/images/default-profile.png',
		name: 'hanmpark',
	});
	const [confettiActive, setConfettiActive] = useState(true);

	useEffect(() => {
		const confettiTimer = setTimeout(() => setConfettiActive(false), 5000);
		return () => clearTimeout(confettiTimer);
	}, []);

	return (
		<Position>
			{/* if the user is in top three then print a podium with badge/medal */}
			<ElementContainer>
				{userPosition === 1 && <div style={{marginBottom: '120px', textTransform: 'uppercase', fontSize: '1.2em'}}>You Won!</div>}
				{userPosition && userPosition <= 3 ? (
					<Layout>
						<TournamentPodium>
								<PlayerAvatar $top={true} src={userDetails?.avatar || '/images/default-profile.png'} alt={userDetails?.name} />
							<TrophyContainer>
								<Badge className={userPosition === 1 ? 'first' : userPosition === 2 ? 'second' : 'third'}>
									{userPosition || 'N/A'}
								</Badge>
							</TrophyContainer>
						</TournamentPodium>
						<PlayerInfo>
							<PlayerName>{userDetails?.name || 'N/A'}</PlayerName>
							<Separator />
							<UserRewards>Reward: {userRewards || '42'} 🪙</UserRewards>
						</PlayerInfo>
						{confettiActive && userPosition === 1 && (
							<Confetti recycle={false} numberOfPieces={500} />
						)}
					</Layout>
				) : (
					<Layout>
					{/* else print the user with no badge/medal */}
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
							<PlayerAvatar src={userDetails?.avatar || '/images/default-profile.png'} alt={userDetails?.name} />
							<div>Position: {userPosition}</div>
						</div>
						<PlayerInfo>
							<PlayerName>{userDetails?.name || 'N/A'}</PlayerName>
							<Separator />
							<UserRewards>Reward: {userRewards || '42'} 🪙</UserRewards>
						</PlayerInfo>
					</Layout>
				)}
			</ElementContainer>
		</Position>
	);
}

export default PositionPage;
