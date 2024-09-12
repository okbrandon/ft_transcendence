import React, { createContext, useEffect, useState } from 'react';
import { isValidToken } from '../api/api';
import { GetUser } from '../api/user';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => isValidToken());
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (isLoggedIn) {
			console.log('🪧 AuthProvider: Getting user...');
			GetUser().then(res => setUser(res.data));
		}
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
			{ children }
		</AuthContext.Provider>
	);
};

export default AuthProvider;
