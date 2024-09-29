import React, { useContext, useState, useEffect } from "react";
import {
	ErrorMessage,
	Form,
	FormControlContainer,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SuccessMessage
} from "../styles/Settings.styled";
import API from "../../../api/api";
import { checkSecurityRestrictions } from "../../../scripts/restrictions";
import { AuthContext } from "../../../context/AuthContext";
import { GetUser } from "../../../api/user";
import TwoFactorAuth from "./TwoFactorAuth";
import TwoFactorAuthPassword from "./TwoFactorAuthSecurity";
import PongButton from "../../../styles/shared/PongButton.styled";

const Security = () => {
	const { user, setUser } = useContext(AuthContext);
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
	const [showPassword, setShowPassword] = useState(false);
	const [showCfPassword, setShowCfPassword] = useState(false);
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
	console.log(error.includes('Phone number'));

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<SectionHeading>Security</SectionHeading>
				<SubSectionHeading>Sign in</SubSectionHeading>
				<label htmlFor="password">Password</label>
				<FormControlContainer>
					<FormInput
						type={showPassword ? 'text' : 'password'}
						id="password"
						placeholder="Change Password"
						value={formData.password}
						onChange={handleChange}
						className={error.includes('Password') ? 'is-invalid' : ''}
						autoComplete="off"
					/>
					{showPassword ? <i className="bi bi-eye-fill" onClick={() => setShowPassword(!showPassword)}/> : <i className="bi bi-eye" onClick={() => setShowPassword(!showPassword)}/>}
				</FormControlContainer>
				<label htmlFor="cfPassword">Confirm Password</label>
				<FormControlContainer>
					<FormInput
						type={showCfPassword ? 'text' : 'password'}
						id="cfPassword"
						placeholder="Confirm New Password"
						value={cfPassword}
						onChange={(e) => setCfPassword(e.target.value)}
						className={error.includes('Passwords') ? 'is-invalid' : ''}
						autoComplete="off"
					/>
					{showCfPassword ? <i className="bi bi-eye-fill" onClick={() => setShowCfPassword(!showCfPassword)}/> : <i className="bi bi-eye" onClick={() => setShowCfPassword(!showCfPassword)}/>}
				</FormControlContainer>
				<SubSectionHeading>Contact Information</SubSectionHeading>
				<label htmlFor="email">Email</label>
				<FormInput
					type="email"
					id="email"
					placeholder="Change Email"
					value={formData.email}
					onChange={handleChange}
					className={error.includes('Email') ? 'is-invalid' : ''}
					autoComplete="email"
				/>
				<label htmlFor="phone_number">Phone number</label>
				<FormInput
					type="tel"
					id="phone_number"
					placeholder="Add Phone Number"
					value={formData.phone_number}
					onChange={handleChange}
					className={error.includes('Phone number') ? 'is-invalid' : ''}
					autoComplete="tel"
				/>
				{success && <SuccessMessage>{success}</SuccessMessage>}
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<PongButton type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</PongButton>
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
