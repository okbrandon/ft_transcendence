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
import { checkSecurityRestrictions } from "../../scripts/restrictions";

const Security = ({ user }) => {
	const [formData, setFormData] = useState({
		email: user.email,
		phone_number: user.phone_number,
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

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password) {
			setFormData(data => ({
				...data,
				password,
			}));
		} else if (formData.password) {
			setFormData(data => {
				const newData = {
					...data,
				};
				delete newData.password;
				return newData;
			})
		}

		const errorMessage = checkSecurityRestrictions();

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
			<label htmlFor="phone">Phone number</label>
			<FormInput
				type="tel"
				id="phone"
				placeholder="Add Phone Number"
				value={formData.phone_number}
				onChange={handleChange}
				autoComplete="tel"
			/>
			<SubSectionHeading>Two-Factor Authentication</SubSectionHeading>
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<SubmitButton>Save Changes</SubmitButton>
		</Form>
	);
};

export default Security;
