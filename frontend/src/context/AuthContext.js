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
				.then(user => {
					setUser(user);
					localStorage.setItem('userID', user.userID);
				})
				.catch(err => {
					console.error(err?.response?.data?.error || 'An error occurred');
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider value={{
			isLoggedIn,
			setIsLoggedIn,
			user,
			setUser,
			loading,
		}}>
			{ children }
		</AuthContext.Provider>
	);
};

export default AuthProvider;
