import React, { useState } from 'react';
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

const AccountPreferences = ({ user }) => {
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

	const validateForm = () => {
		let errorMessage = '';

		if (formData.username && formData.username.length < 4) {
			errorMessage = 'Username must be at least 4 characters long.';
		} else if (formData.username && formData.username.length > 16) {
			errorMessage = 'Username cannot be longer than 16 chracaters.';
		} else if (formData.displayName && formData.displayName.length > 16) {
			errorMessage = 'Display Name cannot be longer than 16 characters.';
		}
		return errorMessage;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errorMessage = validateForm();

		if (errorMessage) {
			setError(errorMessage);
		} else {
			API.patch('/users/@me/profile', formData)
				.then(() => {
					console.log('Account Preferences updated successfully with:', formData);
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
				<p>{bioByteLength} / 280 bytes</p>
			</BioContainer>
			<SubSectionHeading>Profile Image & Background</SubSectionHeading>
			<UploadImage user={user} setFormData={setFormData} handleChange={handleChange}/>
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
