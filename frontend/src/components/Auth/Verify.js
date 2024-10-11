import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
	VerificationContainer,
	VerificationMessage,
	VerificationTitle
} from './styles/Verify.styled';
import Loader from '../../styles/shared/Loader.styled';
import { useTranslation } from 'react-i18next';

const Verify = () => {
	const location = useLocation();
	const { t } = useTranslation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const code = params.get('code');

		if (code) {
			axios.post(process.env.REACT_APP_ENV === 'production' ? '/api/v1/verify' : 'http://localhost:8000/api/v1/verify', { code })
				.then(() => {
					window.location.href = '/signin';
				})
				.catch(() => {
					window.location.href = '/signin';
				});
		} else {
			window.location.href = '404';
		}
	}, [location]);

	return (
		<VerificationContainer>
			<VerificationTitle>{t('auth.callback.email.title')}</VerificationTitle>
			<VerificationMessage>{t('auth.callback.email.subTitle')}</VerificationMessage>
			<Loader/>
		</VerificationContainer>
	);
};

export default Verify;
