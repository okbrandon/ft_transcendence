import React, { useContext, useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import ScrollableComponent from './tools/ScrollableComponent.js';
import { ChatContext } from '../../context/ChatContext.js';
import ChatHeader from './ChatHeader.js';

const Chat = () => {
	const { conversations } = useContext(ChatContext);

	const [DMWindow, setDMWindow] = useState(null);
	const [$isMinimized, setIsMinimized] = useState(true);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [DMWinArrow, setDMWinArrow] = useState(false);
	const [mainWinArrow, setMainWinArrow] = useState(false);
	const [focusedConvID, setFocusedConvID] = useState(null);

	const handleSelectChat = (username) => {
		setDMWindow(username);
	}

	const handleCloseChat = () => {
		setDMWindow(null);
	}

	const DMWinMinimizer = () => {
		setIsMinimized(!$isMinimized);
		setDMWinArrow(!DMWinArrow);
	}

	const mainMinimizer = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setMainWinArrow(!mainWinArrow);
	}

	// const handleSelectFriend = (convo) => {
	// 	console.log('Selected conversation: ', convo);

	// 	const senderID = convo.participants.find((participant) => participant.userID !== convo.receipientID).userID;
	// 	const sender = convo.participants.find((participant) => participant.userID === senderID);
	// 	console.log('Selected sender: ', sender);
	// 	setConvoObject(convo);
	// 	handleSelectChat(sender.username);
	// };

	return (
		<ChatContainer>
			<MainChatContainer $isMinimized={isOverlayMinimized}>
				<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
				{!isOverlayMinimized && (
					<>
						<SearchFriends/>
						<ScrollableComponent>
							<MessagePreview conversationsData={conversations} setFocusedConvID={setFocusedConvID} handleSelectChat={handleSelectChat}/>
						</ScrollableComponent>
					</>
				)}
			</MainChatContainer>
			{DMWindow && (
				<DirectMessage
					conversationID={focusedConvID}
					conversations={conversations}
					username={DMWindow}
					onClose={handleCloseChat}
					$isMinimized={$isMinimized}
					toggleMinimization={DMWinMinimizer}
					arrowState={DMWinArrow}
				/>
			)}
		</ChatContainer>
	);
};

export default Chat;
