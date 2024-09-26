import React, { useState, useContext } from 'react';
import SearchFriendsContainer, {
	SearchInput,
	Dropdown,
	FriendItem,
	FriendActions,
	ActionButton
} from './styles/Chat/SearchFriends.styled';
import { useNavigate } from 'react-router-dom';
import { RelationContext } from '../../context/RelationContext';


export const SearchFriends = ({ onOpenChat }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const { conversations } = useContext(RelationContext);
	const navigate = useNavigate();
	const currentUserID = localStorage.getItem('userID');

	const friends = conversations.map(c => {
		const friend = c.participants.find(user => user.userID !== currentUserID);
		return {
			userID: friend.userID,
			username: friend.username,
			conversationID: c.conversationID,
		};
	});

	const filteredFriends = friends.filter(friend =>
		friend.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleProfile = (friend) => {
		console.log('Profile', friend);
		navigate(`/profile/${friend.username}`);
	};

	const handleInvite = (friend) => {
		// TODO: implement invite functionality when game server is ready
		console.log('Invite', friend);
	};

	const handleBlock = (friend) => {
		console.log('Block', friend);
		// TODO: implement block functionality
		// 
	};

	return (
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
					{filteredFriends.map((friend, index) => (
						<FriendItem key={index} onClick={() => onOpenChat(friend)}>
							{friend}
						</FriendItem>
					))}
				</Dropdown>
				)}
			</SearchFriendsContainer>
		);
};
