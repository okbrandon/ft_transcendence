import React, { useContext, useState } from "react";
import {
	ErrorMessage,
	Form,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SubmitButton,
	SuccessMessage
} from "./styles/Settings.styled";
import API from "../../api/api";
import { checkSecurityRestrictions } from "../../scripts/restrictions";
import { AuthContext } from "../../context/AuthContext";
import { GetUser } from "../../api/user";

const Security = ({ user }) => {
	const { setUser } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		email: user.email,
		phone_number: user.phone_number || '',
		password: '',
	});
	const [cfPassword, setCfPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [serverError, setServerError] = useState('');

	const handleChange = (e) => {
		const { id, value } = e.target;

		setFormData(data => ({
			...data,
			[id]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const submissionData = { ...formData };

		if (!submissionData.password) {
			delete submissionData.password;
		}

		const errorMessage = checkSecurityRestrictions(submissionData, cfPassword);

		if (errorMessage) {
			setError(errorMessage);
			setSuccess('');
			setServerError('');
		} else {
			setLoading(true);
			API.patch('/users/@me/profile', submissionData)
				.then(() => {
					setSuccess('Security updated successfully');
					setError('');
					setServerError('');
					console.log('Security updated successfully with:', submissionData);
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
	}

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Security</SectionHeading>
			<label htmlFor="password">Password</label>
			{error.includes("Password") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="password"
				id="password"
				placeholder="Change Password"
				value={formData.password}
				onChange={handleChange}
				autoComplete="off"
			/>
			<label htmlFor="cfPassword">Confirm Password</label>
			{error.includes("Passwords") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="password"
				id="cfPassword"
				placeholder="Confirm New Password"
				value={cfPassword}
				onChange={(e) => setCfPassword(e.target.value)}
				autoComplete="off"
			/>
			<label htmlFor="email">Email</label>
			{error.includes("Email") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="email"
				id="email"
				placeholder="Change Email"
				value={formData.email}
				onChange={handleChange}
				autoComplete="email"
			/>
			<label htmlFor="phone_number">Phone number</label>
			{error.includes("Phone") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="tel"
				id="phone_number"
				placeholder="Add Phone Number"
				value={formData.phone_number}
				onChange={handleChange}
				autoComplete="tel"
			/>
			<SubSectionHeading>Two-Factor Authentication</SubSectionHeading>
			{success && <SuccessMessage>{success}</SuccessMessage>}
			{serverError && <ErrorMessage>{serverError}</ErrorMessage>}
			<SubmitButton type="submit" disabled={loading}>
				{loading ? 'Saving...' : 'Save Changes'}
			</SubmitButton>
		</Form>
	);
};

export default Security;
