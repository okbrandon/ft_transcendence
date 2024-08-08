import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MatchCardContainer, MatchCard } from "../../styles/Profile.styled";

const matchArrayTest = [
	{player1: "roger", player2: "bradon", winner: "bradon", score1: 20, score2: 21, won: true},
	{player1: "van", player2: "bradon", winner: "bradon", score1: 1, score2: 21, won: true},
	{player1: "min", player2: "bradon", winner: "bradon", score1: 19, score2: 21, won: true},
	{player1: "ian", player2: "bradon", winner: "ian", score1: 20, score2: 19, won: false},
	{player1: "roger", player2: "bradon", winner: "bradon", score1: 20, score2: 21, won: true},
	{player1: "van", player2: "bradon", winner: "bradon", score1: 1, score2: 21, won: true},
	{player1: "min", player2: "bradon", winner: "bradon", score1: 19, score2: 21, won: true},
	{player1: "ian", player2: "bradon", winner: "ian", score1: 20, score2: 19, won: false},
];

const variants = {
	hidden: { opacity: 0, y: -10 },
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
		delay: i * 0.1,
		duration: 0.5,
		},
	}),
};

const MatchHistory = ({ setTabsLoaded }) => {
	const [matchArray, setMatchArray] = useState(null);

	// simulate a fetch request
	useEffect(() => {
		setTimeout(() => {
			setTabsLoaded(true);
			setMatchArray(matchArrayTest);
		}, 2000); // 2 seconds
	}, [setTabsLoaded]); // 2 seconds

	if (!matchArray) {
		console.log('MathHistory: matchArray is null');
		return null;
	}

	return (
		<div>
			{
				matchArray.length === 0 ? (
					<p>No matches played yet</p>
				) : (
					<AnimatePresence>
						{matchArray.map((match, index) => (
								<MatchCardContainer
									key={index}
									$won={match.won}
									initial="hidden"
									animate="visible"
									custom={index}
									variants={variants}
								>
									<MatchCard>
										<tbody>
											<tr>
												<td>
													<h3>{match.player1} vs {match.player2}</h3>
												</td>
												<td style={{textAlign: 'center'}}>
													<h3 style={{fontWeight: 'bold'}}>{match.won ? 'Victory' : 'Defeat'}</h3>
												</td>
												<td>
													<h1>{match.score1} - {match.score2}</h1>
												</td>
											</tr>
										</tbody>
									</MatchCard>
								</MatchCardContainer>
						))}
					</AnimatePresence>
				)
			}
		</div>
	);
};

export default MatchHistory;