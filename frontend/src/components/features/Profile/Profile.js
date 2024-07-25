import React from 'react';
import BackButton from '../../styles/shared/button/BackButton.styled';
import ProfileContainer from '../../styles/layouts/ProfileContainer.styled';
import SearchBar from '../../shared/SearchBar';

const Profile = () => {
	return (
		<>
			<BackButton to='/home/game' hovercolor='#fff'><i className='bi bi-arrow-left' style={{'fontSize': '35px'}}></i></BackButton>
			<ProfileContainer>
				<SearchBar/>
			</ProfileContainer>
		</>
	);
};

export default Profile;
