import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CallbackContainer, CallbackMessage, CallbackTitle } from './styles/Callback.styled';
import Loader from '../../styles/shared/Loader.styled';

const Callback = () => {
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');
		const refresh = params.get('refresh');

		if (token && refresh) {
			localStorage.setItem('token', token);
			localStorage.setItem('refresh', refresh);
			window.location.href = '/';
		} else {
			window.location.href = '404';
		}
	}, [location]);

	return (
		<CallbackContainer>
			<CallbackTitle>Logging you in...</CallbackTitle>
			<CallbackMessage>Please wait while we log you in.</CallbackMessage>
			<Loader/>
		</CallbackContainer>
	);
};

export default Callback;
