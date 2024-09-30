import React, { useState } from 'react';
import {
	WinLossContainer,
	ToggleButton,
	ButtonText
} from '../styles/tools/WinLoss.styled';
// import TimeFrameSelector from './TimeFrameSelector';
import { ButtonsFilterContainer } from '../styles/Leaderboard.styled';

const FilterButton = () => {
	// const [isWin, setIsWin] = useState(true);
	// const [timeFrame, setTimeFrame] = useState('lifetime');

	// const handleToggle = () => {
	// 	setIsWin(!isWin);
	// };

	// const handleTimeFrameChange = (newTimeFrame) => {
	// 	setTimeFrame(newTimeFrame);
	// };

	return (
		<ButtonsFilterContainer>
			<WinLossContainer>
				{/* <ToggleButton $isWin={isWin} onClick={handleToggle}>
					<ButtonText>Top {isWin ? 'Win' : 'Loss'}</ButtonText> */}
				{/* </ToggleButton> */}
			</WinLossContainer>
			{/* <TimeFrameSelector
				timeFrame={timeFrame}
				onTimeFrameChange={handleTimeFrameChange}
			/> */}
		</ButtonsFilterContainer>
	);
};

export default FilterButton;
