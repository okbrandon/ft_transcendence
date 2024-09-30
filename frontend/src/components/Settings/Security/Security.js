import React, { useState, useEffect } from "react";
import {
	ErrorMessage,
	Form,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SuccessMessage
} from "../styles/Settings.styled";
import API from "../../../api/api";
import { checkSecurityRestrictions } from "../../../scripts/restrictions";
import { GetUser } from "../../../api/user";
import TwoFactorAuthToggle from "./2FA/TwoFactorAuthToggle";
import TwoFactorAuthSecurity from "./2FA/TwoFactorAuthSecurity";
import PongButton from "../../../styles/shared/PongButton.styled";
import SignIn from "./SignIn";
import ContactInformation from "./ContactInformation";

const Security = ({ user, setUser }) => {
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

	const handleChange = e => {
		const { id, value } = e.target;

		setFormData(data => ({
			...data,
			[id]: value,
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();

		const submissionData = { ...formData };

		if (!submissionData.password) {
			delete submissionData.password;
		}

		const errorMessage = checkSecurityRestrictions(submissionData, cfPassword);

		if (errorMessage) {
			setError(errorMessage);
			setSuccess('');
		} else if (submissionData.password && has2FA) {
			setShowTwoFactorAuth(true);
		} else {
			setLoading(true);
			API.patch('users/@me/profile', submissionData)
				.then(() => {
					setSuccess('Security updated successfully');
					setError('');
					GetUser()
						.then(user => {
							setUser(user);
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
				<SignIn
					error={error}
					cfPassword={cfPassword}
					setCfPassword={setCfPassword}
					formData={formData}
					handleChange={handleChange}
				/>
				<ContactInformation
					error={error}
					formData={formData}
					handleChange={handleChange}
				/>
				{success && <SuccessMessage>{success}</SuccessMessage>}
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<PongButton type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</PongButton>
			</Form>
			<TwoFactorAuthToggle user={user} handleChange={handleChange}/>
			{showTwoFactorAuth && (
				<TwoFactorAuthSecurity
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
