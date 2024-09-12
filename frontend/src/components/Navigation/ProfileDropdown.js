import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProfileDropdownButton } from './styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';

const ProfileDropdown = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn, user } = useContext(AuthContext);

	const handleLogout = () => {
		setIsLoggedIn(false);
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		navigate('/');
	};

	return (
		<ProfileDropdownButton>
			<Dropdown.Toggle id="dropdown-basic-button">
				PROFILE
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => { navigate(`/profile/${user.username}`) }}>Profile</Dropdown.Item>
				<Dropdown.Item onClick={() => { navigate('/settings') }}>Settings</Dropdown.Item>
				<Dropdown.Divider/>
				<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</ProfileDropdownButton>
	);
};

export default ProfileDropdown;
