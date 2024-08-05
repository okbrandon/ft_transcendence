import React from 'react';
import { useNavigate } from 'react-router-dom';
import StyledProfileButton from '../../styles/shared/button/ProfileButton.styled';
import Dropdown from 'react-bootstrap/Dropdown';

const ProfileButton = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		navigate('/login');
	};

	return (
		<StyledProfileButton id="dropdown-basic-button" title="Profile">
			<Dropdown.Item onClick={() => { navigate('/profile') }}>Profile</Dropdown.Item>
			<Dropdown.Item>Edit</Dropdown.Item>
			<Dropdown.Divider/>
			<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
		</StyledProfileButton>
	);
};

export default ProfileButton;
