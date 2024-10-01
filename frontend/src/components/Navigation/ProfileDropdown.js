import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProfileDropdownButton } from './styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';
import { RelationContext } from '../../context/RelationContext';

const ProfileDropdown = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn, user, setUser } = useContext(AuthContext);
	const { setConversations, setRelations, setFriends, setRequests, setBlockedUsers } = useContext(RelationContext);

	const handleLogout = () => {
		setIsLoggedIn(false);
		setUser(null);
		setRelations([]);
		setFriends([]);
		setRequests([]);
		setBlockedUsers([]);
		setConversations([]);
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
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
