import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProfileDropdownButton } from './styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';
import { RelationContext } from '../../context/RelationContext';

const ProfileDropdown = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn, user, setUser } = useContext(AuthContext);
	const { socketChat, socketStatus, setConversations, setFriends, setRequests } = useContext(RelationContext);

	const handleLogout = () => {
		setIsLoggedIn(false);
		if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
			socketChat.current.close();
		}
		if (socketStatus.current && socketStatus.current.readyState === WebSocket.OPEN) {
			socketStatus.current.close();
		}
		setUser(null);
		setFriends([]);
		setRequests([]);
		setConversations([]);
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
