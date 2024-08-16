import React, { createContext, useState } from 'react';
import { isValidToken } from '../api/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		return isValidToken();
	});

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{ children }
		</AuthContext.Provider>
	);
};

export default AuthProvider;
