import React, { createContext, useEffect, useState } from 'react';
import { isValidToken } from '../api/api';
import { GetUser } from '../api/user';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => isValidToken());
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (isLoggedIn) {
			GetUser()
				.then((res) => {
					setUser(res.data);
					localStorage.setItem('userID', res.data.userID);
				})
				.catch((err) => {
					console.error('Error fetching user data:', err);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, loading }}>
			{ children }
		</AuthContext.Provider>
	);
};

export default AuthProvider;
