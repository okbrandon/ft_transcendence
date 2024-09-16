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
import { GetFriends } from "../../api/friends";

// const friends = [
// 	{ id: 1, name: "Brandon", status: "online" },
// 	{ id: 2, name: "Evan", status: "offline" },
// 	{ id: 3, name: "Kian", status: "online" },
// 	{ id: 4, name: "Alex", status: "offline" },
// 	{ id: 5, name: "Jessica", status: "online" },
// 	{ id: 6, name: "Sarah", status: "offline" },
// 	{ id: 7, name: "John", status: "online" },
// 	{ id: 8, name: "Jane", status: "online" },
// 	{ id: 9, name: "Mathieu", status: "online" },
// ];

const Friends = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [friends, setFriends] = useState([]);
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		GetFriends()
			.then(res => {
				console.log(res.data);
				setFriends(res.data.filter(friend => friend.status === 1));
				setRequests(res.data.filter(friend => friend.status === 0));
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

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
					<RequestsList requests={requests} setRequests={setRequests}/>
				</Tab>
			</Tabs>
		</PageContainer>
	);
};

export default Friends;
