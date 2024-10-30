import React, { useCallback, useEffect, useState } from 'react';
import ProfileImage from './ProfileImage';
import AccountManagement from './AccountManagement';
import ProfileInformation from './ProfileInformation';
import API from '../../../api/api';
import { getUser } from '../../../api/user';
import {
	Form,
	SectionHeading,
} from '../styles/Settings.styled';
import PongButton from '../../../styles/shared/PongButton.styled';
import ErrorMessage from '../../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../context/NotificationContext';

const AccountPreferences = ({ user, setUser }) => {
	const [formData, setFormData] = useState({
		username: user.username,
		displayName: user.displayName === user.username ? '' : user.displayName,
		bio: user.bio,
		lang: user.lang,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { addNotification } = useNotification();
	const { t } = useTranslation();

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	const handleChange = useCallback((e) => {
		const { id, value } = e.target;

		if (id === 'bio') {
			if (value.length <= 280) {
				setFormData(data => ({
					...data,
					[id]: value,
				}));
			}
		} else {
			setFormData(data => ({
				...data,
				[id]: value,
			}));
		}
	}, []);

	const checkAccountPreferencesRestrictions = useCallback(data => {
		if (!data) {
			return '';
		}

		if (!data.username) { // username
			return t('restrictions.username.required');
		} else if (data.username.length < 4 || data.username.length > 16) {
			return t('restrictions.username.invalidLength');
		} else if (/[^a-zA-Z0-9]/.test(data.username)) {
			return t('restrictions.username.invalidCharacters');
		} else if (data.displayName && (data.displayName.length < 4 || data.displayName.length > 16)) {
			return t('restrictions.displayName.invalidLength');
		} else if (/[^a-zA-Z0-9]/.test(data.displayName)) {
			return t('restrictions.displayName.invalidCharacters');
		}

		return '';
	}, [t]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (loading) return;

		const errorMessage = checkAccountPreferencesRestrictions(formData);
		const submissionData = { ...formData };

		if (submissionData.displayName === '') {
			submissionData.displayName = null;
		}

		if (errorMessage) {
			setError(errorMessage);
		} else {
			setLoading(true);
			API.patch('/users/@me/profile', submissionData)
				.then(() => {
					addNotification('success', t('settings.accountPreferences.successMessage'));
					setError('');
					getUser()
						.then(user => {
							setUser(user);
						})
						.catch(err => {
							setError(err?.response?.data?.error || 'An error occurred.');
							addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
						});
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>{t('settings.accountPreferences.title')}</SectionHeading>
			<ProfileInformation
				error={error}
				formData={formData}
				handleChange={handleChange}
			/>
			<ProfileImage
				user={user}
				setFormData={setFormData}
				handleChange={handleChange}
			/>
			<AccountManagement/>
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<PongButton type="submit" disabled={loading}>
				{loading ? t('settings.accountPreferences.loadingButton') : t('settings.accountPreferences.saveButton')}
			</PongButton>
		</Form>
	);
};

export default AccountPreferences;
