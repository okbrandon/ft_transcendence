import React, { createContext, useState, useEffect } from 'react';
import { GetUser } from '../api/user';
import { useNavigate } from 'react-router-dom';

export const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			GetUser()
				.then((response) => {
					setUser(response.data);
					setLoading(false);
				})
				.catch((error) => {
					console.error(error);
					navigate('/login');
				});
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [navigate]);

	return (
		<ProfileContext.Provider value={{ user, loading }}>
			{children}
		</ProfileContext.Provider>
	);
};

export default ProfileProvider;
