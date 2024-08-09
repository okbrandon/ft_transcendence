import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProfileButtonContainer } from '../../styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';

const ProfileButton = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn } = useContext(AuthContext);

	const handleLogout = () => {
		setIsLoggedIn(false);
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		navigate('/');
	};

	return (
		<ProfileButtonContainer id="dropdown-basic-button" title="PROFILE">
			<Dropdown.Item onClick={() => { navigate('/profile') }}>Profile</Dropdown.Item>
			<Dropdown.Item>Edit</Dropdown.Item>
			<Dropdown.Divider/>
			<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
		</ProfileButtonContainer>
	);
};

export default ProfileButton;
