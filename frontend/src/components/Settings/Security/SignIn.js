import React, { useState } from "react";
import { FormControlContainer, FormInput, SubSectionHeading } from "../styles/Settings.styled";
import { useTranslation } from "react-i18next";

const SignIn = ({ error, cfPassword, setCfPassword, formData, handleChange }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showCfPassword, setShowCfPassword] = useState(false);
	const { t } = useTranslation();

	return (
		<>
			<SubSectionHeading>{t('settings.security.subSections.signIn.title')}</SubSectionHeading>
			<label htmlFor="password">{t('settings.security.subSections.signIn.password.title')}</label>
			<FormControlContainer>
				<FormInput
					type={showPassword ? "text" : "password"}
					id="password"
					placeholder={t('settings.security.subSections.signIn.password.placeholder')}
					value={formData.password}
					onChange={handleChange}
					className={error.includes(t('restrictions.password.errorKeyword')) ? "is-invalid" : ""}
					autoComplete="off"
				/>
				{showPassword ? (
					<i className="bi bi-eye-fill" onClick={() => setShowPassword(!showPassword)} />
				) : (
					<i className="bi bi-eye" onClick={() => setShowPassword(!showPassword)} />
				)}
			</FormControlContainer>
			<label htmlFor="cfPassword">{t('settings.security.subSections.signIn.confirmPassword.title')}</label>
			<FormControlContainer>
				<FormInput
					type={showCfPassword ? "text" : "password"}
					id="cfPassword"
					placeholder={t('settings.security.subSections.signIn.confirmPassword.placeholder')}
					value={cfPassword}
					onChange={e => setCfPassword(e.target.value)}
					className={error.includes(t('restrictions.password.errorKeyword')) ? "is-invalid" : ""}
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
