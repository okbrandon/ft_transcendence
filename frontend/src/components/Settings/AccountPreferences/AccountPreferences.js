import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import AccountManagement from './AccountManagement';
import ProfileInformation from './ProfileInformation';
import API from '../../../api/api';
import { GetUser } from '../../../api/user';
import {
	Form,
	SectionHeading,
	SuccessMessage,
} from '../styles/Settings.styled';
import PongButton from '../../../styles/shared/PongButton.styled';
import ErrorMessage from '../../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';

const AccountPreferences = ({ user, setUser }) => {
	const [formData, setFormData] = useState({
		username: user.username,
		displayName: user.displayName === user.username ? '' : user.displayName,
		bio: user.bio,
		lang: user.lang,
	});
	const [bioByteLength, setBioByteLength] = useState(0);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const { t } = useTranslation();

	const handleChange = (e) => {
		const { id, value } = e.target;

		if (id === 'bio') {
			const byteSize = new Blob([value]).size;
			if (byteSize <= 280) {
				setBioByteLength(byteSize);
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
	};

	const checkAccountPreferencesRestrictions = data => {
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
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errorMessage = checkAccountPreferencesRestrictions(formData);
		const submissionData = { ...formData };

		if (submissionData.displayName === '') {
			submissionData.displayName = null;
		}

		if (errorMessage) {
			setError(errorMessage);
			setSuccess('');
		} else {
			setLoading(true);
			API.patch('/users/@me/profile', submissionData)
				.then(() => {
					setSuccess(t('settings.accountPreferences.successMessage'));
					setError('');
					GetUser()
						.then(user => {
							setUser(user);
						})
						.catch(err => {
							setError(err.response?.data?.error || 'An error occurred');
							setSuccess('');
						});
				})
				.catch(err => {
					setError(err.response?.data?.error || 'An error occurred');
					setSuccess('');
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>{t('settings.accountPreferences.title')}</SectionHeading>
			<ProfileInformation
				error={error}
				bioByteLength={bioByteLength}
				formData={formData}
				handleChange={handleChange}
			/>
			<ProfileImage
				user={user}
				setFormData={setFormData}
				handleChange={handleChange}
			/>
			<AccountManagement/>
			{success && <SuccessMessage>{success}</SuccessMessage>}
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<PongButton type="submit" disabled={loading}>
				{loading ? t('settings.accountPreferences.loadingButton') : t('settings.accountPreferences.saveButton')}
			</PongButton>
		</Form>
	);
};

export default AccountPreferences;
