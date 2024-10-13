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
import { useNotification } from '../../context/NotificationContext';
import API from '../../api/api';
import ConfirmationModal from './tools/ConfirmationModal';

export const SearchFriends = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);
	const navigate = useNavigate();
	const userID = localStorage.getItem('userID');
	const { friends, setIsRefetch } = useRelation();
	const { addNotification } = useNotification();

	const handleProfile = (friend) => {
		navigate(`/profile/${friend.username}`);
	};

	const handleInvite = (friend) => {
		console.log('Invite', friend); // Leader: implement game invite functionality here
	};

	const handleBlock = (friend) => {
		setSelectedFriend(friend);
		setIsBlockModalOpen(true);
	};

	const handleBlockUser = () => {
		if (!selectedFriend || !selectedFriend.userID) return;
		if (selectedFriend.userID === userID) {
			addNotification('error', 'You cannot block yourself');
			return;
		}

		API.put('users/@me/relationships', { user: selectedFriend.userID, type: 2 })
			.then(() => {
				addNotification('warning', `User ${selectedFriend.username} blocked.`);
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
		setIsBlockModalOpen(false);
	};

	return (
		<>
			<SearchFriendsContainer>
				<SearchInput
					id="search-input"
					type="text"
					placeholder="Search for Friends..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				{searchQuery && (
					<Dropdown>
						{friends
							.filter(friend => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))
							.map((friend, index) => (
								<FriendItem key={index}>
									<Username>{friend.username}</Username>
									<ButtonContainer>
										<ActionButton color="#6a0dad" onClick={() => handleProfile(friend)}>Profile</ActionButton>
										<ActionButton color="#9AE66E" onClick={() => handleInvite(friend)}>Invite</ActionButton>
										<ActionButton color="#EE4266" onClick={() => handleBlock(friend)}>Block</ActionButton>
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
				title="Block User"
				message={`Are you sure you want to block ${selectedFriend?.username}? You won't be able to see their messages or receive invitations from them.`}
			/>
		</>
	);
};
