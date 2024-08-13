import React, { useContext } from 'react';
import { UserInfoItem, UserInfoContainer } from "../../styles/Profile/User.styled";
import { ProfileContext } from '../../context/ProfileContext';

const matchArrayTest = [
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
];

const calculateTotalWins = (matchArray) => {
	return matchArray.filter((match) => match.scores.playerA > match.scores.playerB).length;
};

// const calculateTotalDefeats = (matchArray) => {
// 	return matchArray.filter((match) => match.scores.playerA < match.scores.playerB).length;
// };

const calculateWinDefeatRatio = (matchArray) => {
	const wins = calculateTotalWins(matchArray);

	return (wins / matchArray.length).toFixed(2);
};

const UserInfo = () => {
	const { user } = useContext(ProfileContext);

	if (!user) {
		console.log('UserInfo: user is null');
		return null;
	}

	return (
		<UserInfoContainer>
			<UserInfoItem>
				<h2 style={{textAlign: 'center'}}>-</h2>
				<h2 id="title">RANKING</h2>
			</UserInfoItem>
			<UserInfoItem>
				<h2 style={{textAlign: 'center'}}>{calculateTotalWins(matchArrayTest)}</h2>
				<h2 id="title">WINS</h2>
			</UserInfoItem>
			<UserInfoItem>
				<h2 style={{textAlign: 'center'}}>{calculateWinDefeatRatio(matchArrayTest)}</h2>
				<h2 id="title">RATIO</h2>
			</UserInfoItem>
		</UserInfoContainer>
	);
};

export default UserInfo;
