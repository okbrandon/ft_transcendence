import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import MainStats from './MainStats';
import { MainBarContainer, SectionContainer } from '../styles/main/MainBar.styled';
import { AuthContext } from '../../../context/AuthContext';
import 'react-circular-progressbar/dist/styles.css';

const MainBar = ({ profileUser, matchArray }) => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	return (
		<SectionContainer>
			<MainBarContainer>
				<MainStats matchArray={matchArray}/>
				<ProfilePicture profileUser={profileUser}/>
				{
					user.username === profileUser.username ? (
						<i className="bi bi-gear-fill" onClick={() => navigate('/settings')}/>
					) : (
						<i className="bi bi-person-fill-add"/>
					)
				}
			</MainBarContainer>
		</SectionContainer>
	);
};

export default MainBar;
