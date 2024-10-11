import React, { createContext, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children, conversations, friends, blockedUsers }) => {
	return (
		<ChatContext.Provider value={{ conversations, friends, blockedUsers }}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
