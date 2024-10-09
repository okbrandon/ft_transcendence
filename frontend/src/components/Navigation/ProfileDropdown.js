import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useRelation } from '../../context/RelationContext';
import { ProfileDropdownButton } from './styles/Navigation.styled';
import { useTranslation } from 'react-i18next';

const ProfileDropdown = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn, user, setUser } = useAuth();
	const { setConversations, setRelations, setFriends, setRequests, setBlockedUsers } = useRelation();
	const { t } = useTranslation();

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
				{t('header.profileButton.title')}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => { navigate(`/profile/${user.username}`) }}>{t('header.profileButton.myProfile')}</Dropdown.Item>
				<Dropdown.Item onClick={() => { navigate('/settings') }}>{t('header.profileButton.settings')}</Dropdown.Item>
				<Dropdown.Divider/>
				<Dropdown.Item onClick={handleLogout}>{t('header.profileButton.logout')}</Dropdown.Item>
			</Dropdown.Menu>
		</ProfileDropdownButton>
	);
};

export default ProfileDropdown;
