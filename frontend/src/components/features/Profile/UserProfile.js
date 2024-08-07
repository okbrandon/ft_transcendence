import React, { useEffect, useState } from 'react';
import UserProfileContainer from '../../styles/layouts/profile/UserProfileContainer.styled';
import ProfileImage from '../../styles/shared/profile/profileImage.styled';
import UserInfoContainer from '../../styles/layouts/profile/UserInfoContainer.styled';
import GetUser from '../../../api/user';
import { useNavigate } from 'react-router-dom';
import ProfileImageContainer from '../../styles/layouts/profile/ProfileImageContainer.styled';

// <i className="bi bi-circle-fill" style={{ fontSize: '20px', color: 'green' }}></i>

const UserProfile = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({});

	useEffect(() => {
		GetUser()
			.then((response) => { setUser(response.data); })
			.catch((error) => { console.log(error); navigate('/login')});
	}, [navigate]);

	return (
		<UserProfileContainer>
			<ProfileImageContainer>
				<ProfileImage src='./prune.jpg' alt='profile picture' roundedCircle/>
				<h2>{user ? user.displayName : ''}</h2>
			</ProfileImageContainer>
			<UserInfoContainer>
				<div>
					<h2 style={{textAlign: 'center'}}>-</h2>
					<h2>Ranking</h2>
				</div>
				<div>
					<h2 style={{textAlign: 'center'}}>-</h2>
					<h2>Total Wins</h2>
				</div>
				<div>
					<h2 style={{textAlign: 'center'}}>-</h2>
					<h2>Ratio</h2>
				</div>
			</UserInfoContainer>
		</UserProfileContainer>
	);
};

export default UserProfile;
