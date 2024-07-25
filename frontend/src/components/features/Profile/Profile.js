import React from 'react';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/button/BackButton.styled';

const Profile = () => {
	return (
		<>
			<BackButton to='/home/game' hovercolor='#fff'><i className='bi bi-arrow-left' style={{'fontSize': '35px'}}></i></BackButton>
			<Container>
				<h1>Profile</h1>
			</Container>
		</>
	);
};

export default Profile;
