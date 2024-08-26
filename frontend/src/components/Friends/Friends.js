import React, { useState } from "react";
import {
	ActionButton,
	Actions,
	FriendCard,
	FriendInfo,
	FriendName,
	FriendStatus,
	FriendsList,
	Header,
	PageContainer,
	RemoveButton,
	SearchInput
} from "./styles/Friends.styled";

// Sample Friends Data
const friends = [
	{ id: 1, name: "Brandon", status: "online" },
	{ id: 2, name: "Evan", status: "offline" },
	{ id: 3, name: "Kian", status: "online" },
	{ id: 4, name: "Alex", status: "offline" },
	{ id: 5, name: "Jessica", status: "online" },
	{ id: 6, name: "Sarah", status: "offline" },
	{ id: 7, name: "John", status: "online" },
	{ id: 8, name: "Jane", status: "online" },
];

// Main Friends Page Component
const Friends = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredFriends = friends.filter(friend =>
		friend.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<PageContainer>
			<Header>
				<h1>Friends</h1>
				<SearchInput
                    id="friends-search"
					type="text"
					placeholder="Search Friends"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Header>
			<FriendsList>
				{filteredFriends.map((friend) => (
					<FriendCard key={friend.id}>
						<FriendInfo>
							<FriendStatus $status={friend.status} />
							<FriendName>{friend.name}</FriendName>
						</FriendInfo>
						<Actions>
							<ActionButton>Invite</ActionButton>
							<ActionButton>Chat</ActionButton>
							<RemoveButton id="remove-button">Remove</RemoveButton>
						</Actions>
					</FriendCard>
				))}
			</FriendsList>
		</PageContainer>
	);
};

export default Friends;
