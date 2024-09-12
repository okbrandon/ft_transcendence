import React, { useContext, useState } from "react";
import {
	ErrorMessage,
	Form,
	FormInput,
	SectionHeading,
	SubmitButton
} from "./styles/Settings.styled";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const Security = () => {
	const { user } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		password: user.password,
		email: user.email,
	});
	const [cfPassword, setCfPassword] = useState('');
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(data => ({
			...data,
			[name]: value,
		}));
	};

	const validateForm = () => {
		let errorMessage = '';

		if (formData.password.length < 8) {
			errorMessage = 'Password must be at least 8 characters long.';
		} else if (new TextEncoder().encode(formData.password).length > 72) {
			errorMessage = 'Password cannot be longer than 72 bytes.';
		} else if (formData.password !== cfPassword) {
			errorMessage = 'Passwords do not match.';
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
					console.log('Security updated successfully with:', formData);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Security</SectionHeading>
			<FormInput
				type="password"
				name="password"
				placeholder="Change Password"
				onChange={handleChange}
			/>
			{error.includes('password') && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="password"
				name="cfPassword"
				placeholder="Confirm New Password"
				value={cfPassword}
				onChange={(e) => setCfPassword(e.target.value)}
			/>
			<FormInput
				type="email"
				name="email"
				placeholder="Change Email"
				value={formData.email}
				onChange={handleChange}
			/>
			{error.includes('email') && <ErrorMessage>{error}</ErrorMessage>}
			<SubmitButton>Save Changes</SubmitButton>
		</Form>
	);
};

export default Security;
