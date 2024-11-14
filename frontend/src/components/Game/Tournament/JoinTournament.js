import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useRelation } from "../../../context/RelationContext";
import { useTournament } from "../../../context/TournamentContext";
import {
	ActiveFriendContainer,
	ButtonContainer,
	FriendItem,
	FriendProfilePicture,
	JoinTournamentContainer,
	KickButton,
	ModalContainer,
	ModalOverlay,
	PageContainer,
	PlayerCard,
	PlayerList,
	PlayerListContainer,
	TournamentHeader,
	WaitingMessage,
} from "../styles/Tournament/JoinTournament.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import API from "../../../api/api";
import { useNotification } from "../../../context/NotificationContext";
import Loader from "../../../styles/shared/Loader.styled";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const JoinTournament = () => {
	const { user, setUser } = useAuth();
	const { addNotification } = useNotification();
	const { tournament, updateTournament, isStartDisabled } = useTournament();
	const { tournamentID } = useParams();
	const { friends } = useRelation();
	const [invite, setInvite] = useState(false);
	const [activeFriends, setActiveFriends] = useState([]);
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchTournament = async () => {
			try {
				const response = await API.get(`/tournaments/${tournamentID}`);
				updateTournament(response.data);
			} catch (error) {
				addNotification('error', error.response?.data?.error || 'Error fetching tournament data');
			} finally {
				setLoading(false);
			}
		};

		fetchTournament();
	}, [tournamentID, addNotification, updateTournament]);

	useEffect(() => {
		if (tournament?.tournamentID) setUser(prev => ({ ...prev, tournamentID: tournament.tournamentID }));
	}, [tournament?.tournamentID, setUser]);

	useEffect(() => {
		setActiveFriends(friends.filter(friend => !!friend.status.online));
	}, [friends]);

	const handleKickPlayer = async (userID) => {
		try {
			await API.post(`/tournaments/${tournamentID}/kick`, { user_id: userID });
		} catch (error) {
			addNotification('error', error.response?.data?.error || 'Error kicking player');
		}
	};

	const handleInvite = () => {
		setInvite(true);
	};

	const handleInviteFriend = async (userID) => {
		try {
			await API.put(`/tournaments/${tournamentID}/invite`, { participants: [userID] });
			addNotification('success', t('game.tournaments.lobbyPage.invite.successMessage'));
		} catch (error) {
			addNotification('error', error.response?.data?.error || 'Error inviting friend');
		}
	};

	const handleLeave = async () => {
		try {
			await API.delete(`/tournaments/@me`);
		} catch (error) {
			addNotification('error', error.response?.data?.error || 'Error leaving tournament');
		}
	};

	const handleStartTournament = async () => {
		try {
			await API.post(`/tournaments/${tournamentID}/start`);
		} catch (error) {
			addNotification('error', error.response?.data?.error || 'Error starting tournament');
		}
	};

	if (loading || !tournament) {
		return (
			<PageContainer>
				<Loader/>
			</PageContainer>
		);
	}

	const renderInviteOverlay = () => (
		<ModalOverlay>
			<ModalContainer>
				<h2>{t('game.tournaments.lobbyPage.invite.title')}</h2>
				<ActiveFriendContainer>
					{activeFriends.length ? (
						activeFriends.map((friend) => (
							<FriendItem key={friend.userID}>
								<div className="friend-info">
									<FriendProfilePicture src={friend.avatarID} alt={`${friend.username}'s avatar`} />
									{friend.displayName}
								</div>
								<PongButton type="button" $width="150px" onClick={() => handleInviteFriend(friend.userID)}>{t('game.tournaments.lobbyPage.invite.inviteButton')}</PongButton>
							</FriendItem>
						))
					) : (
						<p>{t('game.tournaments.lobbyPage.invite.noFriends')}</p>
					)}
				</ActiveFriendContainer>
				<ButtonContainer>
					<PongButton type="button" $width="150px" onClick={() => setInvite(false)}>
						{t('game.tournaments.lobbyPage.invite.cancelButton')}
					</PongButton>
				</ButtonContainer>
			</ModalContainer>
		</ModalOverlay>
	)

	return (
		<>
			<PageContainer>
				<TournamentHeader>
					<h1>{t('game.tournaments.lobbyPage.title')}</h1>
					<h2>{tournament.name}</h2>
				</TournamentHeader>
				<JoinTournamentContainer>
					<PlayerListContainer>
						<h3>{t('game.tournaments.lobbyPage.listing.title')}</h3>
						<PlayerList>
							{tournament.participants.map((player) => (
								<PlayerCard key={player.userID}>
									<div className="player-info">
										<i className={`bi bi-${tournament.owner.userID === player.userID ? 'star' : 'person'}-fill ${tournament.owner.userID === player.userID && 'owner'}`}/>
										<img src={player.avatarID} alt={`${player.username}'s avatar`} />
										{player.displayName || player.username}
									</div>
									{tournament.owner.userID === user.userID && tournament.owner.userID !== player.userID && (
										<KickButton onClick={() => handleKickPlayer(player.userID)}>✖</KickButton>
									)}
								</PlayerCard>
							))}
							{isStartDisabled && (
								<WaitingMessage>
									<div className="waiting-text">
										{t('game.tournaments.lobbyPage.listing.waitingMessage')}
										<Spinner animation="border" variant="spinner-border" />
									</div>
								</WaitingMessage>
							)}
						</PlayerList>
					</PlayerListContainer>
					{isStartDisabled && (
						<WaitingMessage>
							<p>
								{t('game.tournaments.lobbyPage.status', { players: `${tournament.participants.length}`, maxPlayers: `${tournament.maxParticipants}` })}
							</p>
						</WaitingMessage>
					)}
					<ButtonContainer $shouldMargin={!isStartDisabled}>
						<PongButton type="button" $width="150px" onClick={handleLeave}>{t('game.tournaments.lobbyPage.backButton')}</PongButton>
						{user.userID === tournament.owner.userID && (
							<>
								<PongButton type="button" $width="150px" onClick={handleInvite}>{t('game.tournaments.lobbyPage.inviteButton')}</PongButton>
								<PongButton type="button" $width="150px" disabled={isStartDisabled} onClick={handleStartTournament}>{t('game.tournaments.lobbyPage.startButton')}</PongButton>
							</>
						)}
					</ButtonContainer>
				</JoinTournamentContainer>
			</PageContainer>
			{invite && renderInviteOverlay()}
		</>
	);
};

export default JoinTournament;
