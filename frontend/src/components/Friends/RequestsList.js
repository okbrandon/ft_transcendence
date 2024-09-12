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

const friendRequests = [
	{ id: 1, name: "Chris", mutualFriends: 3 },
	{ id: 2, name: "Pat", mutualFriends: 5 },
	{ id: 3, name: "Jordan", mutualFriends: 1 },
];

const RequestsList = () => {
	const [requests, setRequests] = useState(friendRequests);

	const handleAccept = (id) => {
		setRequests(requests.filter((request) => request.id !== id));
		alert("Friend request accepted!");
	};

	const handleDecline = (id) => {
		setRequests(requests.filter((request) => request.id !== id));
		alert("Friend request declined.");
	};

	return (
		<RequestsListContainer>
			{requests.length > 0 ? (
				requests.map((request) => (
					<RequestCard key={request.id}>
						<RequestInfo>
							<RequestProfile>
								<RequestAvatar src="/images/anonymous.png" alt={`${request.name}'s avatar`}/>
								<RequestName>{request.name}</RequestName>
							</RequestProfile>
							<MutualFriends>{request.mutualFriends} mutual friends</MutualFriends>
						</RequestInfo>
						<Actions>
							<AcceptButton onClick={() => handleAccept(request.id)}>Accept</AcceptButton>
							<DeclineButton onClick={() => handleDecline(request.id)}>Decline</DeclineButton>
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
