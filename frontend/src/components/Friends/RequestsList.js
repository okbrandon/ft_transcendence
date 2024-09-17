import React, { useState } from "react";
import {
	AcceptButton,
	Actions,
	DeclineButton,
	MutualFriends,
	NoRequests,
	RequestAvatar,
	RequestCard,
	RequestInfo,
	RequestName,
	RequestProfile,
	RequestsListContainer
} from "./styles/RequestsList.styled";
import API from "../../api/api";
import { GetUserByUsername } from "../../api/user";

// const friendRequests = [
// 	{ id: 1, name: "Chris", mutualFriends: 3 },
// 	{ id: 2, name: "Pat", mutualFriends: 5 },
// 	{ id: 3, name: "Jordan", mutualFriends: 1 },
// ];

const RequestsList = ({ requests, setRequests, userID }) => {
	const handleAccept = (id) => {
		GetUserByUsername(id)
		setRequests(requests.filter((request) => request.userB !== id));
		API.put('users/@me/relationships', { user: id, type: 1 })
			.then(res => {
				console.log('handleAccept:', res);
			})
			.catch(err => {
				console.log('handleAccept error:', err);
			});
	};

	const handleDecline = (id) => {
		setRequests(requests.filter((request) => request.relationshipID !== id));
		alert("Friend request declined.");
	};

	return (
		<RequestsListContainer>
			{requests.length > 0 ? (
				requests.map((request, key) => (
					<RequestCard key={key}>
						<RequestInfo>
							<RequestProfile>
								<RequestAvatar src="/images/default-profile.png" alt={`${request.name}'s avatar`}/>
								<RequestName>{request.relationshipID}</RequestName>
							</RequestProfile>
						</RequestInfo>
						{request.userA === userID ? (
							<Actions>
								<AcceptButton onClick={() => handleAccept(request.userB)}>Accept</AcceptButton>
								<DeclineButton onClick={() => handleDecline(request.userB)}>Decline</DeclineButton>
							</Actions>
						) : (
							<p>Request sent</p>
						)}
					</RequestCard>
				))
			) : (
				<NoRequests>No new friend requests</NoRequests>
			)}
		</RequestsListContainer>
	);
};

export default RequestsList;
