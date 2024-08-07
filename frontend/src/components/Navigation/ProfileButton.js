import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProfileButtonContainer } from '../../styles/Navigation.styled';

const ProfileButton = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		navigate('/login');
	};

	return (
		<ProfileButtonContainer id="dropdown-basic-button" title="Profile">
			<Dropdown.Item onClick={() => { navigate('/profile') }}>Profile</Dropdown.Item>
			<Dropdown.Item>Edit</Dropdown.Item>
			<Dropdown.Divider/>
			<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
		</ProfileButtonContainer>
	);
};

export default ProfileButton;
