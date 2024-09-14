import React, { useState } from "react";
import {
	ErrorMessage,
	Form,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SubmitButton
} from "./styles/Settings.styled";
import API from "../../api/api";

const Security = ({ user }) => {
	const [formData, setFormData] = useState({
		email: user.email,
	});
	const [password, setPassword] = useState('');
	const [cfPassword, setCfPassword] = useState('');
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { id, value } = e.target;

		setFormData(data => ({
			...data,
			[id]: value,
		}));
	};

	const validateForm = () => {
		let errorMessage = '';

		if (formData.password && formData.password.length < 8) {
			errorMessage = 'Password must be at least 8 characters long.';
		} else if (formData.password && new TextEncoder().encode(formData.password).length > 72) {
			errorMessage = 'Password cannot be longer than 72 bytes.';
		} else if (formData.password && formData.password !== cfPassword) {
			errorMessage = 'Passwords do not match.';
		} else if (!formData.email) {
			errorMessage = 'Email is required.';
		} else if (formData.email.length > 64) {
			errorMessage = 'Email cannot be longer than 64 characters.';
		} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
			errorMessage = 'Invalid Email address, did not match the required format.';
		}
		return errorMessage;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password) {
			setFormData(data => ({
				...data,
				password,
			}));
		}

		const errorMessage = validateForm();

		if (errorMessage) {
			setError(errorMessage);
		} else {
			API.patch('/users/@me/profile', formData)
				.then(() => {
					setError('');
					console.log('Security updated successfully with:', formData);
				})
				.catch((err) => {
					setError(err);
				});
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Security</SectionHeading>
			<label htmlFor="password">Password</label>
			<FormInput
				type="password"
				id="password"
				placeholder="Change Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				autoComplete="off"
			/>
			<label htmlFor="cfPassword">Confirm Password</label>
			<FormInput
				type="password"
				id="cfPassword"
				placeholder="Confirm New Password"
				value={cfPassword}
				onChange={(e) => setCfPassword(e.target.value)}
				autoComplete="off"
			/>
			<label htmlFor="email">Email</label>
			<FormInput
				type="email"
				id="email"
				placeholder="Change Email"
				value={formData.email}
				onChange={handleChange}
				autoComplete="email"
			/>
			<SubSectionHeading>Two-Factor Authentication</SubSectionHeading>
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<SubmitButton>Save Changes</SubmitButton>
		</Form>
	);
};

export default Security;
