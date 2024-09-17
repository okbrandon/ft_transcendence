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
		GetFriends(userID)
			.then(res => {
				setFriends(res);
			})
			.catch(err => {
				console.log('Error fetching friends:', err);
			});
		GetRequests(userID)
			.then(res => {
				setRequests(res);
			})
			.catch(err => {
				console.log('Error fetching requests:', err);
			});
	}, []);

	if (!friends || !requests) {
		return (
			<PageContainer>
				<Loader/>
			</PageContainer>
		);
	} // Return the request without extra details if there's an error

	// const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
					<FriendsList friends={friends}/>
				</Tab>
				<Tab eventKey="requests" title="Requests">
					<RequestsList requests={requests} setRequests={setRequests} setFriends={setFriends}/>
				</Tab>
			</Tabs>
		</PageContainer>
	);
};

export default Friends;
