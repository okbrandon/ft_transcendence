import React, { useContext } from 'react';
import { MainBarContainer, MainBarLayout } from '../../../styles/Profile/main/MainBar.styled';
import 'react-circular-progressbar/dist/styles.css';
import ProfilePicture from './ProfilePicture';
import MainStats from './MainStats';
import { AuthContext } from '../../../context/AuthContext';

const MainBar = ({ user, matchArray, setShowSettings }) => {
	const { username } = useContext(AuthContext);

	return (
		<MainBarLayout>
			<MainBarContainer>
				<MainStats matchArray={matchArray}/>
				<ProfilePicture user={user}/>
				{
					username === user.username ? (
						<i className="bi bi-gear-fill" onClick={() => setShowSettings(true)}/>
					) : (
						<i className="bi bi-person-fill-add"/>
					)
				}
			</MainBarContainer>
		</MainBarLayout>
	);
};

export default MainBar;
