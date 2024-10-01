import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
	VerificationContainer,
	VerificationMessage,
	VerificationTitle
} from './styles/Verify.styled';
import Loader from '../../styles/shared/Loader.styled';

const Verify = () => {
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const code = params.get('code');

		if (code) {
			axios.post(`http://localhost:8888/api/v1/verify`, { code })
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
			<VerificationTitle>Verifying your email...</VerificationTitle>
			<VerificationMessage>Please wait while we complete your email verification.</VerificationMessage>
			<Loader/>
		</VerificationContainer>
	);
};

export default Verify;
