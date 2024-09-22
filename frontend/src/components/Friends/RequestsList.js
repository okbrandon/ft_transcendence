import React from "react";
import {
	Actions,
	RequestAvatar,
	RequestCard,
	RequestInfo,
	RequestName,
	RequestProfile,
} from "./styles/RequestsList.styled";
import API from "../../api/api";
import PongButton from "../../styles/shared/PongButton.styled";
import { NoRelation } from "./styles/Friends.styled";
import { ListContainer } from "./styles/FriendsList.styled";
import { useNavigate } from "react-router-dom";

const RequestsList = ({ requests, setRequests, setFriends }) => {
	const navigate = useNavigate();

	const handleAccept = (focusedRequest) => {
		API.put('users/@me/relationships', { user: focusedRequest.userID, type: 1 })
			.then(() => {
				setFriends(prev => ([...prev, focusedRequest]));
				setRequests(prev => prev.filter((request) => request.username !== focusedRequest.username));
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
	};

	const handleDecline = (id) => {
		API.delete(`users/@me/relationships/${id}`)
			.then(() => {
				setRequests(requests.filter(request => request.relationID !== id));
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
	};

	const handleProfile = username => {
		navigate(`/profile/${username}`);
	};

	return (
		<ListContainer>
			{requests.length ? (
				requests.map((request, key) => (
					<RequestCard key={key}>
						<RequestInfo>
							<RequestProfile onClick={() => handleProfile(request.username)}>
								<RequestAvatar src={request.avatarID} alt={`${request.displayName}'s avatar`}/>
								<RequestName>{request.displayName}</RequestName>
							</RequestProfile>
						</RequestInfo>
						{request.is === 'sender' ? (
							<Actions>
								<PongButton onClick={() => handleAccept(request)}>Accept</PongButton>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationID)}>Decline</PongButton>
							</Actions>
						) : (
							<Actions>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationID)}>Cancel</PongButton>
							</Actions>
						)}
					</RequestCard>
				))
			) : (
				<NoRelation>No new friend requests</NoRelation>
			)}
		</ListContainer>
	);
};

export default RequestsList;
