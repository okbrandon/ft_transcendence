import React, { useEffect, useState } from "react";
import {
	Header,
	PageContainer,
	SearchInput,
} from "./styles/Friends.styled";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import RequestsList from "./RequestsList";
import FriendsList from "./FriendsList";
import Loader from "../../styles/shared/Loader.styled";
import { GetFriends, GetRequests } from "../../api/friends";

const Friends = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [friends, setFriends] = useState(null);
	const [requests, setRequests] = useState(null);
	const userID = localStorage.getItem('userID');

	useEffect(() => {
		const fetchFriendsAndRequests = async () => {
			try {
				const [friendsResponse, requestsResponse] = await Promise.all([
					GetFriends(userID),
					GetRequests(userID),
				]);

				setFriends(friendsResponse);
				setRequests(requestsResponse);
			} catch (err) {
				console.error(err.response.data.error);
			}
		};

		fetchFriendsAndRequests();
	  }, [userID]);

	if (!friends || !requests) {
		return (
			<PageContainer>
				<Loader/>
			</PageContainer>
		);
	}

	const filteredFriends = friends.filter(friend => friend.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<PageContainer>
			<Header>
				<h1>FRIENDS</h1>
				<SearchInput
					id="friends-search"
					type="text"
					placeholder="Search Friends"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Header>
			<Tabs
				defaultActiveKey="friends"
				className="mb-3"
			>
				<Tab eventKey="friends" title="Friends">
					<FriendsList friends={filteredFriends}/>
				</Tab>
				<Tab eventKey="requests" title="Requests">
					<RequestsList requests={requests} setRequests={setRequests} setFriends={setFriends}/>
				</Tab>
			</Tabs>
		</PageContainer>
	);
};

export default Friends;
