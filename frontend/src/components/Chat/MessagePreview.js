import styled from 'styled-components';
import ProfilePicture from './styles/global/ProfilePicture.styled';
import ScrollableComponent from './tools/ScrollableComponent';
import { useChat } from '../../context/ChatContext';
import { truncateText } from './tools/TruncateText';

const PreviewContainer = styled.div`
	padding: 10px;
	border-top: 1px solid #ddd;
	color: #333;
	display: flex;
	align-items: center;
	cursor: pointer;
`;

const MessageContent = styled.div`
	display: flex;
	flex-direction: column;
`;

const Sender = styled.strong`
	font-size: 1.1rem;
`;

const MessageText = styled.span`
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.5;
	font-size: 0.9rem;
`;

const NoFriendsMessage = styled.div`
	padding: 20px;
	text-align: center;
	color: #666;
	font-size: 1.2rem;
`;

export const MessagePreview = ({ handleSelectChat }) => {
	const userID = localStorage.getItem('userID');
	const { conversations, friends, blockedUsers } = useChat();

	console.log('In MessagePreview friends: ', friends);

	const handleSelectFriend = (friend) => {
		const convo = conversations.find((convo) => {
			const other = convo.participants.find(participant => participant.userID !== userID);
			return other.username === friend.username;
		});

		handleSelectChat(friend.username, convo ? convo.conversationID : null);
	};

	const renderFriendPreview = (friend, index, message) => (
		<PreviewContainer key={index} onClick={() => handleSelectFriend(friend)}>
			<ProfilePicture
				src={friend.avatarID || 'images/default-profile.png'}
				alt={`${friend.username}'s profile picture`}
			/>
			<MessageContent>
				<Sender>{friend.username}</Sender>
				<MessageText>{truncateText(message, 50)}</MessageText>
			</MessageContent>
		</PreviewContainer>
	);

	if (friends.length === 0) {
		return <NoFriendsMessage>Make some friends so you can chat with them !</NoFriendsMessage>;
	}

	return (
		<ScrollableComponent>
			{conversations.map((convo, index) => {
				const other = convo.participants.find(participant => participant.userID !== userID);
				const isBlocked = blockedUsers.find(blocked => blocked.userID === other.userID);
				const friendExists = friends.find(friend => friend.username === other.username);
				console.log('In MessagePreview friendExists: ', friendExists);

				if (!isBlocked && friendExists) {
					if (convo.messages.length === 0) {
						return renderFriendPreview(other, index, 'Start a new conversation');
					}
					const lastMessage = convo.messages[convo.messages.length - 1];
					return renderFriendPreview(other, index, lastMessage.content);
				}})}
		</ScrollableComponent>
	);
};
