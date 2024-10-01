import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CallbackContainer, CallbackMessage, CallbackTitle } from './styles/Callback.styled';
import Loader from '../../styles/shared/Loader.styled';
import { useTranslation } from 'react-i18next';

const Callback = () => {
	const location = useLocation();
	const { t } = useTranslation();

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
			<CallbackTitle>{t('auth.callback.logIn.title')}</CallbackTitle>
			<CallbackMessage>{t('auth.callback.logIn.subTitle')}</CallbackMessage>
			<Loader/>
		</CallbackContainer>
	);
};

export default Callback;
