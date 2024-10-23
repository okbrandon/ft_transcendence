import React, { useState, useEffect } from 'react';
import {
	WinnerPageContainer,
	WinnerContainer,
	WinnerText,
	WinnerImage,
	WinnerUsername,
	WinnerPrize,
	TrophyIcon,
	WinnerBio,
	TimerText,
} from '../styles/Tournament/WinnerTournament.styled';
import Confetti from 'react-confetti';
import { GetUser, formatUserData } from '../../../api/user';
import { calculateTotalWins } from '../../../scripts/match';
import API from '../../../api/api';

// data template
const matchData = {
	matchID: "match_12345678901234567890",
	playerA: {
		id: "user_12345678901234567890",
		platform: "web"
	},
	playerB: {
		id: "user_12345678901234567891",
		platform: "web"
	},
	scores: {
		"user_12345678901234567890": 5,
		"user_12345678901234567891": 3
	},
	winnerID: "user_12345678901234567890",
	startedAt: "2024-02-20T12:00:00Z",
	finishedAt: "2024-02-20T12:30:00Z",
	flags: 2
};

const WinnerTournament = () => {
	const [confettiActive, setConfettiActive] = useState(true);
	const [timeLeft, setTimeLeft] = useState(null); // Set the initial countdown time
	const [winnerDetails, setWinnerDetails] = useState(null);
	const [totalWins, setTotalWins] = useState(0); // Set total wins

	useEffect(() => {
		const confettiTimer = setTimeout(() => setConfettiActive(false), 5000);
		return () => clearTimeout(confettiTimer);
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		if (timeLeft === 0) {
			window.location.href = '/';
		}

		return () => clearInterval(timer);
	}, [timeLeft]);

	useEffect(() => {
		const fetchWinnerDetails = async () => {
			try {
				const user = await GetUser(matchData.winnerID);
				const formattedUser = formatUserData(user);
				setWinnerDetails(formattedUser);

				const userMatches = await API.get(`/users/${matchData.winnerID}/matches`);
				setTotalWins(calculateTotalWins(userMatches.data));
			} catch (error) {
				console.error('Failed to fetch winner details', error);
			}
		};

		fetchWinnerDetails();
	}, []);

	const getWinnerMessage = (wins) => {
		if (wins > 10) {
			return `Wow, ${winnerDetails.displayName}! You're a legend with ${wins} wins!`;
		} else if (wins > 5) {
			return `Great job, ${winnerDetails.displayName}! You've won ${wins} tournaments!`;
		} else {
			return `Congrats ${winnerDetails.displayName}! You're off to a strong start with ${wins} wins!`;
		}
	};

	if (!winnerDetails) {
		return <div>Loading...</div>;
	}

	return (
		<WinnerPageContainer>
			<WinnerText>You're the winner!</WinnerText>
			<TimerText>Redirecting you to home page in {timeLeft} seconds...</TimerText>

			<WinnerContainer>
				<TrophyIcon className='bi bi-trophy-fill'></TrophyIcon>
				<WinnerImage src={winnerDetails.avatarID} alt='Winner' />
				<WinnerUsername>{winnerDetails.displayName}</WinnerUsername>
				<WinnerPrize>Prize: 42 🪙</WinnerPrize>
				<WinnerBio>{getWinnerMessage(totalWins)}</WinnerBio>
			</WinnerContainer>

			{confettiActive && (
				<Confetti recycle={false} numberOfPieces={300} />
			)}
		</WinnerPageContainer>
	);
};

export default WinnerTournament;
