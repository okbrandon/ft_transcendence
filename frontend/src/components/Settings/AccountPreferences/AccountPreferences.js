import React, { useContext, useState } from 'react';
import {
	BioContainer,
	ErrorMessage,
	Form,
	FormInput,
	LanguageDropdown,
	SectionHeading,
	SubSectionHeading,
	SubmitButton,
	SuccessMessage,
	TextArea,
} from '../styles/Settings.styled';
import UploadImage from './UploadImage';
import API from '../../../api/api';
import DeleteAccount from './DeleteAccount';
import { checkAccountPreferencesRestrictions } from '../../../scripts/restrictions';
import { AuthContext } from '../../../context/AuthContext';
import { GetUser } from '../../../api/user';

const AccountPreferences = ({ user }) => {
	const { setUser } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		username: user.username,
		displayName: user.displayName,
		bio: user.bio,
		lang: user.lang,
	});
	const [bioByteLength, setBioByteLength] = useState(0);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [serverError, setServerError] = useState('');

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
			setServerError('');
		} else {
			setLoading(true);
			API.patch('/users/@me/profile', submissionData)
				.then(() => {
					setSuccess('Account Preferences updated successfully.');
					setError('');
					setServerError('');
					console.log('Account Preferences updated successfully with:', submissionData);
					GetUser()
						.then((res) => {
							setUser(res.data);
							console.log('User data refetched and updated in context:', res.data);
						})
						.catch((err) => {
							setServerError(err.response.data.error);
							setSuccess('');
							setError('');
						});
				})
				.catch((err) => {
					setServerError(err.response.data.error);
					setSuccess('');
					setError('');
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Account Preferences</SectionHeading>
			<SubSectionHeading>Profile Information</SubSectionHeading>
			<label htmlFor="username">Username</label>
			{error.includes("Username") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="text"
				id="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				autoComplete='off'
			/>
			<label htmlFor="displayName">Display Name</label>
			{error.includes("Display Name") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="text"
				id="displayName"
				placeholder="Display Name"
				value={formData.displayName}
				onChange={handleChange}
			/>
			<label htmlFor="bio">Bio</label>
			<BioContainer>
				<TextArea
					id="bio"
					placeholder="Tell us about yourself"
					value={formData.bio || ''}
					rows="4"
					cols="50"
					onChange={handleChange}
				/>
				<p>{bioByteLength} / 280</p>
			</BioContainer>
			<SubSectionHeading>Profile Image & Background</SubSectionHeading>
			<UploadImage user={user} setFormData={setFormData} handleChange={handleChange}/>
			<SubSectionHeading>General Preferences</SubSectionHeading>
			<label htmlFor="lang">Language</label>
			<LanguageDropdown
				id="lang"
				value={formData.lang}
				onChange={handleChange}
			>
				<option value="en">🇬🇧 English</option>
				<option value="es">🇪🇸 Spanish</option>
				<option value="fr">🇫🇷 French</option>
			</LanguageDropdown>
			<SubSectionHeading>Account Management</SubSectionHeading>
			<DeleteAccount/>
			{success && <SuccessMessage>{success}</SuccessMessage>}
			{serverError && <ErrorMessage>{serverError}</ErrorMessage>}
			<SubmitButton type="submit" disabled={loading}>
				{loading ? 'Saving...' : 'Save Changes'}
			</SubmitButton>
		</Form>
	);
};

export default AccountPreferences;