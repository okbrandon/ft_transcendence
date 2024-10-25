import React from 'react';

// styled components
const Stage = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 20px;
	padding-top: 50px;
`;

const Brackets = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`;

const Bracket = styled.div`
	display: flex;
	flex-direction: row;
	gap: 120px;
`;

const BracketTitleRound = styled.div`
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-bottom: 100px;
`;

// where the user and their opponent will be displayed
const StandingBracket = styled.div`
	display: flex;
	flex-direction: column;
`;

const PlayerBox = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border: 1px solid #333;
	padding: 10px;
	margin: 4px;
	color: white;
	border-radius: 5px;
	background-color: #333;
	box-shadow: 0 0 10px 0 #333;
`;

const Username = styled.div`
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding: 0 100px 0 10px;
`;

const Score = styled.div`
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
`;

// display the user's tournament matches
const OverviewPage = ({ tournamentData }) => {
	return (
		<Stage>
			<Brackets>
				<Bracket>
					{tournamentData.matches.map((match, index) => {
						console.log(match);
						return (
							<StandingBracket key={index}>
								<BracketTitleRound>Round {index}</BracketTitleRound>
								<PlayerBox>
									<Username>{match.PlayerA.username}</Username>
									<Score>{match.scores[match.PlayerA.id]}</Score>
								</PlayerBox>
								<PlayerBox>
									<Username>{match.PlayerB.username}</Username>
									<Score>{match.scores[match.PlayerB.id]}</Score>
								</PlayerBox>
							</StandingBracket>
						)
					})}
				</Bracket>
			</Brackets>
		</Stage>
	)

}



export default OverviewPage;
