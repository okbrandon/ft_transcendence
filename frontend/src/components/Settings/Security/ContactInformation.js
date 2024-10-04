import React from "react";
import { FormInput, SubSectionHeading } from "../styles/Settings.styled";
import { useTranslation } from "react-i18next";

const ContactInformation = ({ error, formData, handleChange }) => {
	const { t } = useTranslation();

	return (
		<>
			<SubSectionHeading>{t('settings.security.subSections.contactInformation.title')}</SubSectionHeading>
			<label htmlFor="email">{t('settings.security.subSections.contactInformation.email.title')}</label>
			<FormInput
				type="email"
				id="email"
				placeholder={t('settings.security.subSections.contactInformation.email.placeholder')}
				value={formData.email}
				onChange={handleChange}
				className={error.includes(t('restrictions.email.errorKeyword')) ? "is-invalid" : ""}
				autoComplete="email"
			/>
			<label htmlFor="phone_number">{t('settings.security.subSections.contactInformation.phoneNumber.title')}</label>
			<FormInput
				type="tel"
				id="phone_number"
				placeholder={t('settings.security.subSections.contactInformation.phoneNumber.placeholder')}
				value={formData.phone_number}
				onChange={handleChange}
				className={error.includes(t('restrictions.phoneNumber.errorKeyword')) ? "is-invalid" : ""}
				autoComplete="tel"
			/>
		</>
	);
};

export default ContactInformation;
