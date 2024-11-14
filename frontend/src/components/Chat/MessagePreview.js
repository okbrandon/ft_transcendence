import styled from 'styled-components';
import ProfilePicture from './styles/global/ProfilePicture.styled';
import ScrollableComponent from './tools/ScrollableComponent';
import { useChat } from '../../context/ChatContext';
import { useRelation } from '../../context/RelationContext';
import { useTranslation } from 'react-i18next';

const PreviewContainer = styled.div`
	padding: 20px;
	color: #fff;
	display: flex;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	cursor: pointer;

	&:hover {
		background: #29293d;
	}

	&.not-read {
		background: #1e1e2b;
	}
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

export const MessagePreview = () => {
	const { conversations, handleSelectChat, unreadCounts } = useChat();
	const { friends } = useRelation();
	const userID = localStorage.getItem('userID');
	const { t } = useTranslation();

	const handleSelectFriend = (friend) => {
		const convo = conversations.find((convo) => {
			const other = convo.participants.find(participant => participant.userID !== userID);
			return other.username === friend.username;
		});

		handleSelectChat(friend.username, convo ? convo.conversationID : null);
	};

	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) {
			return text;
		}
		return text.substring(0, maxLength) + '...';
	};

	const renderFriendPreview = (friend, index, message, lastMessageUserId = null, convId) => {
		if (lastMessageUserId && lastMessageUserId === userID) {
			message = t('chat.message.sentByMe') + message;
		}

		return (
			<PreviewContainer
				key={index}
				onClick={() => handleSelectFriend(friend)}
				className={unreadCounts[convId] ? 'not-read' : ''}
			>
				<ProfilePicture
					src={friend.avatarID}
					alt={`${friend.displayName || friend.username}'s profile picture`}
				/>
				<MessageContent>
					<Sender>{friend.displayName || friend.username}</Sender>
					<MessageText>{truncateText(message, 24)}</MessageText>
				</MessageContent>
			</PreviewContainer>
		);
	};

	if (friends.length === 0) {
		return <NoFriendsMessage>{t('chat.message.noFriends')}</NoFriendsMessage>;
	}

	return (
		<ScrollableComponent>
			{conversations.map((convo, index) => {
				const other = convo.participants.find(participant => participant.userID !== userID);
				const friendExists = friends.find(friend => friend.username === other.username);

				if (friendExists) {
					if (convo.messages.length === 0) {
						return renderFriendPreview(other, index, t('chat.message.newConversation'));
					}
					const lastMessage = convo.messages[convo.messages.length - 1];
					return renderFriendPreview(other, index, lastMessage.content, lastMessage.sender.userID, convo.conversationID);
				}
				return null;
			})}
		</ScrollableComponent>
	);
};
