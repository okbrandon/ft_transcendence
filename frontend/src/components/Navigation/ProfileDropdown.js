import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import ProfileDropdownButton from '../../styles/shared/button/ProfileDropdownButton.styled';
import { AuthContext } from '../../context/AuthContext';

const ProfileDropdown = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn, username } = useContext(AuthContext);

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
				<Dropdown.Item onClick={() => { navigate(`/profile/${username}`) }}>Profile</Dropdown.Item>
				<Dropdown.Item>Edit</Dropdown.Item>
				<Dropdown.Divider/>
				<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</ProfileDropdownButton>
	);
};

export default ProfileDropdown;
