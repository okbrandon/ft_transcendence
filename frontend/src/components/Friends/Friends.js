import React, { useContext, useEffect, useState } from "react";
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
import { RelationContext } from "../../context/RelationContext";

const Friends = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const { isRefresh, setIsRefresh } = useContext(RelationContext);
	const [friends, setFriends] = useState(null);
	const [requests, setRequests] = useState(null);

	useEffect(() => {
		const fetchFriendsAndRequests = async () => {
			try {
				const [friendsResponse, requestsResponse] = await Promise.all([
					GetFriends(),
					GetRequests(),
				]);
				setFriends(friendsResponse);
				setRequests(requestsResponse);
			} catch (err) {
				console.error(err.response.data.error);
			}
		};

		fetchFriendsAndRequests();
		setIsRefresh(false);
	}, [setIsRefresh, isRefresh]);

	// useEffect(() => {
	// 	if (friends && updateUserStatus) {
	// 		console.log(updateUserStatus);
	// 		setFriends(prev => prev.map(f => {
	// 			if (f.username === updateUserStatus.username) {
	// 				return {
	// 					...f,
	// 					status: updateUserStatus.status,
	// 				};
	// 			}
	// 			return f;
	// 		}));
	// 		setUpdateUserStatus(null);
	// 	}
	// }, [updateUserStatus, setUpdateUserStatus, friends]);

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
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Header>
			<Tabs
				defaultActiveKey="friends"
				className="mb-3"
			>
				<Tab eventKey="friends" title="Friends">
					<FriendsList friends={filteredFriends} setFriends={setFriends}/>
				</Tab>
				<Tab eventKey="requests" title="Requests">
					<RequestsList requests={requests} setRequests={setRequests} setFriends={setFriends}/>
				</Tab>
			</Tabs>
		</PageContainer>
	);
};

export default Friends;
