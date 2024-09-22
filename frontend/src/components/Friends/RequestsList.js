import React from "react";
import {
	Actions,
	RequestAvatar,
	RequestCard,
	RequestInfo,
	RequestName,
	RequestProfile,
	RequestsListContainer
} from "./styles/RequestsList.styled";
import API from "../../api/api";
import PongButton from "../../styles/shared/PongButton.styled";
import { NoRelation } from "./styles/Friends.styled";

const RequestsList = ({ requests, setRequests, setFriends }) => {
	const userID = localStorage.getItem('userID');

	const handleAccept = (focusedRequest) => {
		API.put('users/@me/relationships', { user: focusedRequest.user, type: 1 })
			.then(() => {
				setFriends(prev => ([...prev, { ...focusedRequest, status: 1 }]));
				setRequests(prev => prev.filter((relation) => relation.relationshipID !== focusedRequest.relationshipID));
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
			{requests.length ? (
				requests.map((relation, key) => (
					<RequestCard key={key}>
						<RequestInfo>
							<RequestProfile>
								<RequestAvatar src={relation.user.avatarID} alt={`${relation.user.displayName}'s avatar`}/>
								<RequestName>{relation.displayName}</RequestName>
							</RequestProfile>
						</RequestInfo>
						{relation.user.userID === userID ? (
							<Actions>
								<PongButton onClick={() => handleAccept(relation)}>Accept</PongButton>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(relation.relationshipID)}>Decline</PongButton>
							</Actions>
						) : (
							<Actions>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(relation.relationshipID)}>Cancel</PongButton>
							</Actions>
						)}
					</RequestCard>
				))
			) : (
				<NoRelation>No new friend requests</NoRelation>
			)}
		</RequestsListContainer>
	);
};

export default RequestsList;
