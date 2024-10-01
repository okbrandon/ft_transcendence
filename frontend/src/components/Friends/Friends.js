import React, { useContext, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import RequestsList from "./RequestsList";
import FriendsList from "./FriendsList";
import {
	Header,
	PageContainer,
	SearchInput,
} from "./styles/Friends.styled";
import Loader from "../../styles/shared/Loader.styled";
import { RelationContext } from "../../context/RelationContext";

const Friends = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const { friends, requests, setIsRefetch } = useContext(RelationContext);

	if (!friends || !requests) {
		return (
			<PageContainer>
				<Loader/>
			</PageContainer>
		);
	}

	const filteredFriends = friends.filter(friend => {
		return friend.displayName.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<PageContainer>
			<Header>
				<h1>FRIENDS</h1>
				<SearchInput
					id="friends-search"
					type="text"
					placeholder="Search Friends"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</Header>
			<Tabs
				defaultActiveKey="friends"
				className="mb-3"
			>
				<Tab eventKey="friends" title="Friends">
					<FriendsList friends={filteredFriends} setIsRefetch={setIsRefetch}/>
				</Tab>
				<Tab eventKey="requests" title="Requests">
					<RequestsList requests={requests} setIsRefetch={setIsRefetch}/>
				</Tab>
			</Tabs>
		</PageContainer>
	);
};

export default Friends;
