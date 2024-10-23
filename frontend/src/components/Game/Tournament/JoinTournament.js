import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useRelation } from "../../../context/RelationContext";
import { useTonneru } from "../../../context/TonneruContext";
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
	WaitingMessage,
} from "../styles/Tournament/JoinTournament.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import API from "../../../api/api";

const JoinTournament = () => {
	const navigate = useNavigate();
	const { tournamentID } = useParams();
	const { friends } = useRelation();
	const [invite, setInvite] = useState(false);
	const [activeFriends, setActiveFriends] = useState([]);
	const [isStartDisabled, setIsStartDisabled] = useState(true);
	const [tournament, setTournament] = useState(null);
	const [loading, setLoading] = useState(true);
	const { addEventListener, removeEventListener } = useTonneru();

	const updateTournament = useCallback((updatedTournament) => {
		setTournament(updatedTournament);
		setIsStartDisabled(updatedTournament?.participants?.length < 2);
	}, []);

	const handleTournamentUpdate = useCallback((data) => {
		console.log('Received tournament update:', data);
		switch (data.e) {
			case 'TOURNAMENT_JOIN':
				console.log('Processing TOURNAMENT_JOIN event');
				updateTournament(prevTournament => {
					console.log('Previous tournament state:', prevTournament);
					if (!prevTournament || !prevTournament.participants || !Array.isArray(prevTournament.participants)) {
						console.error('Invalid tournament data:', prevTournament);
						return prevTournament;
					}
					const userExists = prevTournament.participants.some(p => p && p.userID === data?.d?.user?.userID);
					if (userExists) {
						console.log('User already in tournament, not adding:', data?.d?.user);
						return prevTournament;
					}
					if (!data?.d?.user) {
						console.error('Invalid user data:', data?.d);
						return prevTournament;
					}
					const newTournament = {
						...prevTournament,
						participants: [...prevTournament.participants, data.d.user]
					};
					console.log('New tournament state after join:', newTournament);
					return newTournament;
				});
				break;
			case 'TOURNAMENT_LEAVE':
			case 'TOURNAMENT_KICK':
				console.log(`Processing ${data.e} event`);
				updateTournament(prevTournament => {
					console.log('Previous tournament state:', prevTournament);
					if (!prevTournament || !data || !data.d || !data.d.user || !data.d.user.userID) {
						console.error('Invalid data for tournament update:', { prevTournament, data });
						return prevTournament;
					}
					const newTournament = {
						...prevTournament,
						participants: prevTournament.participants && Array.isArray(prevTournament.participants)
							? prevTournament.participants.filter(p => p && p.userID && p.userID !== data.d.user.userID)
							: []
					};
					console.log('New tournament state after leave/kick:', newTournament);
					if (prevTournament.owner && prevTournament.owner.userID && data.d.user.userID === prevTournament.owner.userID) {
						console.log('Tournament owner left, navigating back');
						navigate(-1);
					}
					return newTournament;
				});
				break;
			case 'TOURNAMENT_READY':
				console.log('Tournament ready event received, navigating to play');
				console.log('Tournament data:', data.d);
				navigate(`/tournaments/${tournamentID}/play`, { state: { tournamentData: data.d } });
				break;
			default:
				console.warn('Unhandled tournament update event:', data.e);
				break;
		}
	}, [tournamentID, navigate, updateTournament]);

	useEffect(() => {
		const fetchTournament = async () => {
			try {
				const response = await API.get(`/tournaments/${tournamentID}`);
				updateTournament(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching tournament:", error);
				setLoading(false);
			}
		};

		fetchTournament();

		console.log('Setting up event listeners');
		addEventListener('TOURNAMENT_JOIN', handleTournamentUpdate);
		addEventListener('TOURNAMENT_LEAVE', handleTournamentUpdate);
		addEventListener('TOURNAMENT_KICK', handleTournamentUpdate);
		addEventListener('TOURNAMENT_READY', handleTournamentUpdate);

		return () => {
			console.log('Cleaning up event listeners');
			removeEventListener('TOURNAMENT_JOIN', handleTournamentUpdate);
			removeEventListener('TOURNAMENT_LEAVE', handleTournamentUpdate);
			removeEventListener('TOURNAMENT_KICK', handleTournamentUpdate);
			removeEventListener('TOURNAMENT_READY', handleTournamentUpdate);
		};
	}, [tournamentID, addEventListener, removeEventListener, handleTournamentUpdate]);

	useEffect(() => {
		setActiveFriends(friends.filter(friend => !!friend.status.online));
	}, [friends]);

	const handleKickPlayer = async (userID) => {
		try {
			await API.post(`/tournaments/${tournamentID}/kick`, { user_id: userID });
		} catch (error) {
			console.error("Error kicking player:", error);
		}
	};

	const handleInvite = () => {
		setInvite(true);
	};

	const handleInviteFriends = async () => {
		try {
			const inviteeIDs = activeFriends.map(friend => friend.userID);
			await API.put(`/tournaments/${tournamentID}`, { participants: inviteeIDs });
			setInvite(false);
		} catch (error) {
			console.error("Error inviting friends:", error);
		}
	};

	const handleStartTournament = async () => {
		try {
			await API.post(`/tournaments/${tournamentID}/start`);
		} catch (error) {
			console.error("Error starting tournament:", error);
		}
	};

	if (loading) {
		return <Spinner animation="border" />;
	}

	return (
		<>
			<PageContainer>
				<h1>Tournament</h1>
				<h2>{tournament.name}</h2>
				<JoinTournamentContainer>
					<PlayerList>
						{tournament.participants.map((player) => (
							<PlayerCard key={player.userID}>
								{player.displayName || player.username}
								{tournament.owner.userID === player.userID ? null : (
									<KickButton onClick={() => handleKickPlayer(player.userID)}>✖</KickButton>
								)}
							</PlayerCard>
						))}
					</PlayerList>
					<ButtonContainer>
						<PongButton type="button" $width="150px" onClick={() => navigate(-1)}>Back</PongButton>
						<PongButton type="button" $width="150px" onClick={handleInvite}>Invite</PongButton>
						<PongButton type="button" $width="150px" disabled={isStartDisabled} onClick={handleStartTournament}>Start</PongButton>
					</ButtonContainer>
					<WaitingMessage>
						{isStartDisabled ? (
							<>
								<p>Waiting for more players to join...</p>
								<Spinner animation="border" />
							</>
						) : (
							<p>Ready to start!</p>
						)}
					</WaitingMessage>
				</JoinTournamentContainer>
			</PageContainer>
			{invite && (
				<ModalOverlay>
					<ModalContainer>
						<h2>Invite Friends</h2>
						<ActiveFriendContainer>
							{activeFriends.length ? (
								activeFriends.map((friend) => (
									<FriendItem key={friend.userID}>
										<FriendProfilePicture src={friend.avatarID} alt={`${friend.username}'s avatar`} />
										{friend.displayName || friend.username}
									</FriendItem>
								))
							) : (
								<p>No active friends available to invite</p>
							)}
						</ActiveFriendContainer>
						<ButtonContainer>
							<PongButton type="button" $width="150px" onClick={() => setInvite(false)}>
								Cancel
							</PongButton>
							<PongButton type="button" $width="150px" onClick={handleInviteFriends}>
								Invite
							</PongButton>
						</ButtonContainer>
					</ModalContainer>
				</ModalOverlay>
			)}
		</>
	);
};

export default JoinTournament;
