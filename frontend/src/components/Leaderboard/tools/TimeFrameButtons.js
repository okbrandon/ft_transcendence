import React from 'react';
import {
	BackgroundContainer,
	TimeFrameButton,
	TimeFrameContainer
} from '../styles/Leaderboard.styled';
import { useTranslation } from 'react-i18next';

const TimeFrameButtons = ({ timeFrame, handleTimeFrameChange }) => {
	const { t } = useTranslation();

	return (
		<TimeFrameContainer>
			<BackgroundContainer>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('lifetime')}
					$isActive={timeFrame === 'lifetime'}
				>
					{t('leaderboard.timeFrame.lifetime')}
				</TimeFrameButton>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('daily')}
					$isActive={timeFrame === 'daily'}
				>
					{t('leaderboard.timeFrame.daily')}
				</TimeFrameButton>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('weekly')}
					$isActive={timeFrame === 'weekly'}
				>
					{t('leaderboard.timeFrame.weekly')}
				</TimeFrameButton>
			</BackgroundContainer>
		</TimeFrameContainer>
	);
};

export default TimeFrameButtons;
