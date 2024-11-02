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

export const SearchFriends = ({ toggleMinimization }) => {
	const navigate = useNavigate();
	const { friends, setIsRefetch } = useRelation();
	const { addNotification } = useNotification();
	const { conversations, handleSelectChat } = useChat();
	const [searchQuery, setSearchQuery] = useState('');
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);
	const userID = localStorage.getItem('userID');

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
			addNotification('error', 'You cannot block yourself');
			return;
		}

		API.put('users/@me/relationships', { user: selectedFriend.userID, type: 2 })
			.then(() => {
				addNotification('warning', `User ${selectedFriend.username} blocked.`); // should notifications also be translated?
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
					placeholder="Search for Friends..." // Brandon translate this line
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
										{/* Brandon translate these buttons */}
										<ActionButton color="#6a0dad" onClick={(e) => handleProfile(friend, e)}>Profile</ActionButton>
										<ActionButton color="#9AE66E" onClick={(e) => handleInvite(friend, e)}>Invite</ActionButton>
										<ActionButton color="#EE4266" onClick={(e) => handleBlock(friend, e)}>Block</ActionButton>
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
				// Brandon translate these lines below
				title="Block User"
				message={`Are you sure you want to block ${selectedFriend?.username}? You won't be able to see their messages or receive invitations from them.`}
			/>
		</>
	);
};
