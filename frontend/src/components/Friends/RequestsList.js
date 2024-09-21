import React from "react";
import {
	Actions,
	NoRequests,
	RequestAvatar,
	RequestCard,
	RequestInfo,
	RequestName,
	RequestProfile,
	RequestsListContainer
} from "./styles/RequestsList.styled";
import API from "../../api/api";
import PongButton from "../../styles/shared/PongButton.styled";

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
								<RequestAvatar src={request.avatarID && request.avatarID !== 'default' ? request.avatarID : '/images/default-profile.png'} alt={`${request.name}'s avatar`}/>
								<RequestName>{request.displayName}</RequestName>
							</RequestProfile>
						</RequestInfo>
						{request.userA !== localStorage.getItem('userID') ? (
							<Actions>
								<PongButton onClick={() => handleAccept(request)}>Accept</PongButton>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationshipID)}>Decline</PongButton>
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
