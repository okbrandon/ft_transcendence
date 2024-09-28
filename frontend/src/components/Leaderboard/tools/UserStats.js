import React from 'react';
import {
	UserStatsContainer,
} from '../styles/tools/UserStats.styled';

const UserScore = ({ score }) => {
	return <div>Your Score: {score}</div>;
}

const UserPosition = ({ position }) => {
	return <div>Your Position: {position}</div>;
}

const UserStats = ({ score, position }) => {
	return (
		<UserStatsContainer>
			<UserScore score={score} />
			<UserPosition position={position} />
		</UserStatsContainer>
	);
}

export default UserStats;
