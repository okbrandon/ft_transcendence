import React, { createContext, useState, useEffect } from 'react';
import { GetUserByUsername } from '../api/user';
import { useNavigate } from 'react-router-dom';

export const ProfileContext = createContext();

const ProfileProvider = ({ children, username }) => {
	const [loading, setLoading] = useState(true);
	const [profileUser, setProfileUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		console.log('🪧 ProfileProvider: Getting user...');
		const timeoutId = setTimeout(() => {
			GetUserByUsername(username)
				.then((response) => {
					setProfileUser(response.data);
					setLoading(false);
				})
				.catch((error) => {
					console.error(error);
					navigate('/*'); // maybe 404 page
				});
		}, 1500);

		return () => clearTimeout(timeoutId);
	}, [navigate, username]);

	return (
		<ProfileContext.Provider value={{ profileUser, setProfileUser, loading }}>
			{children}
		</ProfileContext.Provider>
	);
};

export default ProfileProvider;
