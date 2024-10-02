import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useRelation } from '../../context/RelationContext';
import { ProfileDropdownButton } from './styles/Navigation.styled';

const ProfileDropdown = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn, user, setUser } = useAuth();
	const { setConversations, setRelations, setFriends, setRequests, setBlockedUsers } = useRelation();

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
