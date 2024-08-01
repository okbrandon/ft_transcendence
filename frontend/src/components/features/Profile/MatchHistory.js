import React from "react";
import MatchCardContainer from "../../styles/layouts/MatchCardContainer.styled";
import MatchCard from "../../styles/shared/profile/matchCard.styled";

const matchArrayTest = [
	{player1: "roger", player2: "bradon", winner: "bradon", score1: 20, score2: 21, won: true},
	{player1: "van", player2: "bradon", winner: "bradon", score1: 1, score2: 21, won: true},
	{player1: "min", player2: "bradon", winner: "bradon", score1: 19, score2: 21, won: true},
	{player1: "ian", player2: "bradon", winner: "ian", score1: 20, score2: 19, won: false}
];

const MatchHistory = () => {
	return (
		<div>
			{
				matchArrayTest.length === 0 ? <p>No matches played yet</p> :
				matchArrayTest.map((match, index) => (
						<MatchCardContainer key={index} $won={match.won}>
							<MatchCard>
								<tbody>
									<tr>
										<td>
											<h3>{match.player1} vs {match.player2}</h3>
										</td>
										<td>
											<p><strong>WINNER: {match.winner}</strong></p>
										</td>
										<td>
											<h1>{match.score1} - {match.score2}</h1>
										</td>
									</tr>
								</tbody>
							</MatchCard>
						</MatchCardContainer>
					)
				)
			}
		</div>
	);
};

export default MatchHistory;