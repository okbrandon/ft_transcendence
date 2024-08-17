import React, { createContext, useEffect, useState } from 'react';
import { isValidToken } from '../api/api';
import { GetUser } from '../api/user';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => isValidToken());
	const [username, setUsername] = useState(null);

	useEffect(() => {
		if (isLoggedIn) {
			console.log('🪧 AuthProvider: Getting user...');
			GetUser().then(user => setUsername(user.data.username));
		}
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username }}>
			{ children }
		</AuthContext.Provider>
	);
};

export default AuthProvider;
