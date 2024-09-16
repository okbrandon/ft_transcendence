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

// const friendRequests = [
// 	{ id: 1, name: "Chris", mutualFriends: 3 },
// 	{ id: 2, name: "Pat", mutualFriends: 5 },
// 	{ id: 3, name: "Jordan", mutualFriends: 1 },
// ];

const RequestsList = ({ requests, setRequests }) => {
	console.log('RequestsList:', requests);
	const handleAccept = (id) => {
		console.log('handleAccept:', id);
		setRequests(requests.filter((request) => request.userB !== id));
		API.put('users/@me/relationships', { user: id, type: 1 })
			.then(res => {
				console.log('handleAccept:', res);
			})
			.catch(err => {
				console.log('handleAccept error:', err);
			})
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
						<Actions>
							<AcceptButton onClick={() => handleAccept(request.userB)}>Accept</AcceptButton>
							<DeclineButton onClick={() => handleDecline(request.userB)}>Decline</DeclineButton>
						</Actions>
					</RequestCard>
				))
			) : (
				<NoRequests>No new friend requests</NoRequests>
			)}
		</RequestsListContainer>
	);
};

export default RequestsList;
