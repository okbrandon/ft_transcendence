import React, { useState } from "react";
import { FormControlContainer, FormInput, SubSectionHeading } from "../styles/Settings.styled";

const SignIn = ({ error, cfPassword, setCfPassword, formData, handleChange }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showCfPassword, setShowCfPassword] = useState(false);

	return (
		<>
			<SubSectionHeading>Sign In</SubSectionHeading>
			<label htmlFor="password">Password</label>
			<FormControlContainer>
				<FormInput
					type={showPassword ? "text" : "password"}
					id="password"
					placeholder="Change Password"
					value={formData.password}
					onChange={handleChange}
					className={error.includes("Password") ? "is-invalid" : ""}
					autoComplete="off"
				/>
				{showPassword ? (
					<i className="bi bi-eye-fill" onClick={() => setShowPassword(!showPassword)} />
				) : (
					<i className="bi bi-eye" onClick={() => setShowPassword(!showPassword)} />
				)}
			</FormControlContainer>
			<label htmlFor="cfPassword">Confirm Password</label>
			<FormControlContainer>
				<FormInput
					type={showCfPassword ? "text" : "password"}
					id="cfPassword"
					placeholder="Confirm New Password"
					value={cfPassword}
					onChange={e => setCfPassword(e.target.value)}
					className={error.includes("Passwords") ? "is-invalid" : ""}
					autoComplete="off"
				/>
				{showCfPassword ? (
					<i className="bi bi-eye-fill" onClick={() => setShowCfPassword(!showCfPassword)} />
				) : (
					<i className="bi bi-eye" onClick={() => setShowCfPassword(!showCfPassword)} />
				)}
			</FormControlContainer>
		</>
	);
};

export default SignIn;
