import React from 'react';
import UserProfileContainer from '../../styles/layouts/profile/UserProfileContainer.styled';
import ProfileImage from '../../styles/shared/profile/profileImage.styled';
import UserInfoContainer from '../../styles/layouts/profile/UserInfoContainer.styled';

const UserProfile = () => {

	return (
		<UserProfileContainer>
			<ProfileImage src='./prune.jpg' alt='profile picture' roundedCircle/>
			<UserInfoContainer>
				<h2 style={{fontSize: '2rem'}}><i className="bi bi-circle-fill" style={{ fontSize: '20px', color: 'green' }}></i> Bradon</h2>
				<p><strong>Rank: </strong>Dummy</p>
				<p><strong>Last online: </strong>xx/xx/xxxx xx:xx</p>
			</UserInfoContainer>
		</UserProfileContainer>
	);
};

export default UserProfile;
