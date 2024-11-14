import React, { useState } from 'react';
import SearchFriendsContainer, {
	SearchInput,
	Dropdown,
	FriendItem,
	Username,
	ButtonContainer,
	ActionButton,
} from './styles/Chat/SearchFriends.styled';
import { useNavigate } from 'react-router-dom';
import { useRelation } from '../../context/RelationContext.js';
import { useChat } from '../../context/ChatContext.js';
import { useNotification } from '../../context/NotificationContext';
import API from '../../api/api';
import ConfirmationModal from './tools/ConfirmationModal';
import { useTranslation } from 'react-i18next';

export const SearchFriends = ({ toggleMinimization }) => {
	const navigate = useNavigate();
	const { friends, setIsRefetch } = useRelation();
	const { addNotification } = useNotification();
	const { conversations, handleSelectChat } = useChat();
	const [searchQuery, setSearchQuery] = useState('');
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);
	const userID = localStorage.getItem('userID');
	const { t } = useTranslation();

	const handleSelectFriend = (friend) => {
		const convo = conversations.find((convo) => {
			const other = convo.participants.find(participant => participant.userID !== userID);
			return other.username === friend.username;
		});

		handleSelectChat(friend.username, convo ? convo.conversationID : null);
		setSearchQuery('');
	};

	const handleProfile = (friend, e) => {
		e.stopPropagation();
		navigate(`/profile/${friend.username}`);
		setSearchQuery('');
		toggleMinimization();
	};

	const handleInvite = (friend, e) => {
		e.stopPropagation();
		setSearchQuery('');
		toggleMinimization();
	};

	const handleBlock = (friend, e) => {
		e.stopPropagation();
		setSelectedFriend(friend);
		setIsBlockModalOpen(true);
		setSearchQuery('');
	};

	const handleBlockUser = () => {
		if (!selectedFriend || !selectedFriend.userID) return;
		if (selectedFriend.userID === userID) {
			addNotification('error', t('chat.block.selfBlock'));
			return;
		}

		API.put('users/@me/relationships', { user: selectedFriend.userID, type: 2 })
			.then(() => {
				addNotification('warning', t('chat.block.userBlocked', { username: `${selectedFriend.username}` }));
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
		setIsBlockModalOpen(false);
		toggleMinimization();
	};

	return (
		<>
			<SearchFriendsContainer>
				<SearchInput
					id="search-input"
					type="text"
					placeholder={t('chat.searchBar.placeholder')}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					autoComplete='off'
				/>
				{searchQuery && (
					<Dropdown>
						{friends
							.filter(friend => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))
							.map((friend, index) => (
								<FriendItem key={index} onClick={() => handleSelectFriend(friend)}>
									<Username >{friend.username}</Username>
									<ButtonContainer>
										<ActionButton color="#6a0dad" onClick={(e) => handleProfile(friend, e)}>{t('chat.profile.title')}</ActionButton>
										<ActionButton color="#9AE66E" onClick={(e) => handleInvite(friend, e)}>{t('chat.invite.challenge.title')}</ActionButton>
										<ActionButton color="#EE4266" onClick={(e) => handleBlock(friend, e)}>{t('chat.block.title')}</ActionButton>
									</ButtonContainer>
								</FriendItem>
							))}
					</Dropdown>
				)}
			</SearchFriendsContainer>

			<ConfirmationModal
				isOpen={isBlockModalOpen}
				onClose={() => setIsBlockModalOpen(false)}
				onConfirm={handleBlockUser}
				title={t('chat.block.title')}
				message={t('chat.block.confirmMessage', { username: `${selectedFriend?.username}` })}
			/>
		</>
	);
};
