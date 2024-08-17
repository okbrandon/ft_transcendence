import React, { createContext, useState, useEffect } from 'react';
import { GetUserByUsername } from '../api/user';
import { useNavigate } from 'react-router-dom';

export const ProfileContext = createContext();

const ProfileProvider = ({ children, username }) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		console.log('🪧 ProfileProvider: Getting user...');
		const timeoutId = setTimeout(() => {
			GetUserByUsername(username)
				.then((response) => {
					setUser(response.data);
					setLoading(false);
				})
				.catch((error) => {
					console.error(error);
					navigate('/login'); // maybe 404 page
				});
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [navigate, username]);

	return (
		<ProfileContext.Provider value={{ user, loading }}>
			{children}
		</ProfileContext.Provider>
	);
};

export default ProfileProvider;
