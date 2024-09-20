import React, { useContext, useState, useEffect } from "react";
import {
	ErrorMessage,
	Form,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SubmitButton,
	SuccessMessage
} from "../styles/Settings.styled";
import API from "../../../api/api";
import logger from "../../../api/logger";
import { checkSecurityRestrictions } from "../../../scripts/restrictions";
import { AuthContext } from "../../../context/AuthContext";
import { GetUser } from "../../../api/user";
import TwoFactorAuth from "./TwoFactorAuth";
import TwoFactorAuthPassword from "./TwoFactorAuthSecurity";

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
	const [has2FA, setHas2FA] = useState(false);
	const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		API.get('auth/totp')
			.then(res => {
				setHas2FA(res.data.has_otp);
			})
			.catch(err => {
				console.error(err.response.data.error);
			})
	}, []);

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
		if (!submissionData.phone_number) {
			delete submissionData.phone_number;
		}

		const errorMessage = checkSecurityRestrictions(submissionData, cfPassword);

		if (errorMessage) {
			setError(errorMessage);
			setSuccess('');
		} else if (submissionData.password && has2FA) {
			setShowTwoFactorAuth(true);
		} else {
			setLoading(true);
			API.patch('/users/@me/profile', submissionData)
				.then(() => {
					setSuccess('Security updated successfully');
					setError('');
					logger('Security updated successfully with:', submissionData);
					GetUser()
						.then(res => {
							setUser(res.data);
							logger('User data refetched and updated in context:', res.data);
						})
						.catch(err => {
							setError(err.response.data.error);
							setSuccess('');
						});
				})
				.catch(err => {
					setError(err.response.data.error);
					setSuccess('');
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<SectionHeading>Security</SectionHeading>
				<SubSectionHeading>Sign in</SubSectionHeading>
				<label htmlFor="password">Password</label>
				<FormInput
					type="password"
					id="password"
					placeholder="Change Password"
					value={formData.password}
					onChange={handleChange}
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
				<SubSectionHeading>Contact Information</SubSectionHeading>
				<label htmlFor="email">Email</label>
				<FormInput
					type="email"
					id="email"
					placeholder="Change Email"
					value={formData.email}
					onChange={handleChange}
					autoComplete="email"
				/>
				<label htmlFor="phone_number">Phone number</label>
				<FormInput
					type="tel"
					id="phone_number"
					placeholder="Add Phone Number"
					value={formData.phone_number}
					onChange={handleChange}
					autoComplete="tel"
				/>
				{success && <SuccessMessage>{success}</SuccessMessage>}
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<SubmitButton type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</SubmitButton>
			</Form>
			<SubSectionHeading>Two-Factor Authentication</SubSectionHeading>
			<TwoFactorAuth user={user} handleChange={handleChange}/>
			{showTwoFactorAuth && (
				<TwoFactorAuthPassword
					formData={formData}
					setUser={setUser}
					setSuccess={setSuccess}
					setShowTwoFactorAuth={setShowTwoFactorAuth}
				/>
			)}
		</>
	);
};

export default Security;
