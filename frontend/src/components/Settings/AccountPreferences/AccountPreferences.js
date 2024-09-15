import React, { useContext, useState } from 'react';
import {
	BioContainer,
	ErrorMessage,
	Form,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SubmitButton,
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
	});
	const [bioByteLength, setBioByteLength] = useState(0);
	const [error, setError] = useState('');

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

		if (errorMessage) {
			setError(errorMessage);
		} else {
			API.patch('/users/@me/profile', formData)
				.then(() => {
					setError('');
					console.log('Account Preferences updated successfully with:', formData);
					GetUser()
						.then((res) => {
							setUser(res.data);
							console.log('User data refetched and updated in context:', res.data);
						})
						.catch((err) => {
							console.error('Error fetching updated user data:', err);
						});
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Account Preferences</SectionHeading>
			<SubSectionHeading>Profile Information</SubSectionHeading>
			<label htmlFor="username">Username</label>
			<FormInput
				type="text"
				id="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				autoComplete='off'
			/>
			{error.includes("Username") && <ErrorMessage>{error}</ErrorMessage>}
			<label htmlFor="displayName">Display Name</label>
			<FormInput
				type="text"
				id="displayName"
				placeholder="Display Name"
				value={formData.displayName}
				onChange={handleChange}
			/>
			{error.includes("Display Name") && <ErrorMessage>{error}</ErrorMessage>}
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
			<UploadImage user={user} setFormData={setFormData} handleChange={handleChange} setError={setError}/>
			<SubSectionHeading>General Preferences</SubSectionHeading>
			<FormInput
				type="text"
				id="language"
				placeholder="Language Preference"
			/>
			<SubSectionHeading>Account Management</SubSectionHeading>
			<DeleteAccount/>
			<SubmitButton type="submit">Save Changes</SubmitButton>
		</Form>
	);
};

export default AccountPreferences;
