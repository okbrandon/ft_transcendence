import React from 'react';
import {
	BackgroundContainer,
	TimeFrameButton,
	TimeFrameContainer
} from '../styles/Leaderboard.styled';

const TimeFrameButtons = ({ timeFrame, handleTimeFrameChange }) => {
	return (
		<TimeFrameContainer>
			<BackgroundContainer>
				{/* Brandon: translate each buttons */}
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('lifetime')}
					$isActive={timeFrame === 'lifetime'}
				>
					Lifetime
				</TimeFrameButton>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('daily')}
					$isActive={timeFrame === 'daily'}
				>
					Daily
				</TimeFrameButton>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('weekly')}
					$isActive={timeFrame === 'weekly'}
				>
					Weekly
				</TimeFrameButton>
			</BackgroundContainer>
		</TimeFrameContainer>
	);
};

export default TimeFrameButtons;
