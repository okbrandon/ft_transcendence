import React from "react";
import {
	AcceptButton,
	Actions,
	DeclineButton,
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

const RequestsList = ({ requests, setRequests, setFriends }) => {
	const handleAccept = (focusedRequest) => {
		API.put('users/@me/relationships', { user: focusedRequest.userA, type: 1 })
			.then(res => {
				setFriends(prev => ([...prev, { ...focusedRequest, status: 1 }]));
				setRequests(prev => prev.filter((request) => request.relationshipID !== focusedRequest.relationshipID));
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
	};

	const handleDecline = (id) => {
		setRequests(requests.filter((request) => request.relationshipID !== id));
		alert("Friend request declined.");
	};

	return (
		<RequestsListContainer>
			{requests ? (
				requests.map((request, key) => (
					<RequestCard key={key}>
						<RequestInfo>
							<RequestProfile>
								<RequestAvatar src={request.avatarID ? request.avatarID : '/images/default-profile.png'} alt={`${request.name}'s avatar`}/>
								<RequestName>{request.displayName}</RequestName>
							</RequestProfile>
						</RequestInfo>
						{request.userA !== localStorage.getItem('userID') ? (
							<Actions>
								<AcceptButton onClick={() => handleAccept(request)}>Accept</AcceptButton>
								<DeclineButton onClick={() => handleDecline(request.relationshipID)}>Decline</DeclineButton>
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
