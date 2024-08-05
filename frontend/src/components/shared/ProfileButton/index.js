import React from 'react';
import { useNavigate } from 'react-router-dom';
import StyledProfileButton from '../../styles/shared/button/ProfileButton.styled';
import Dropdown from 'react-bootstrap/Dropdown';
import { Logout } from '../../../api/auth';

const ProfileButton = () => {
	const navigate = useNavigate();

	return (
		<StyledProfileButton id="dropdown-basic-button" title="Profile">
			<Dropdown.Item onClick={() => { navigate('/profile') }}>Profile</Dropdown.Item>
			<Dropdown.Item>Edit</Dropdown.Item>
			<Dropdown.Divider/>
			<Dropdown.Item onClick={Logout}>Logout</Dropdown.Item>
		</StyledProfileButton>
	);
};

export default ProfileButton;
