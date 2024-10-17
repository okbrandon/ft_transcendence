import React from "react";
import { BioContainer, FormInput, SubSectionHeading, TextArea } from "../styles/Settings.styled";
import { useTranslation } from "react-i18next";

const ProfileInformation = ({ error, formData, handleChange }) => {
	const { t } = useTranslation();

	return (
		<>
			<SubSectionHeading>{t('settings.accountPreferences.subSections.profileInformation.title')}</SubSectionHeading>
			<label htmlFor="username">{t('settings.accountPreferences.subSections.profileInformation.username.title')}</label>
			<FormInput
				type="text"
				id="username"
				placeholder={t('settings.accountPreferences.subSections.profileInformation.username.placeholder')}
				value={formData.username}
				onChange={handleChange}
				className={error.includes(t('restrictions.username.errorKeyword')) ? "is-invalid" : ""}
				autoComplete="off"
			/>
			<label htmlFor="displayName">{t('settings.accountPreferences.subSections.profileInformation.displayName.title')}</label>
			<FormInput
				type="text"
				id="displayName"
				placeholder={t('settings.accountPreferences.subSections.profileInformation.displayName.placeholder')}
				value={formData.displayName || ""}
				onChange={handleChange}
				className={error.includes(t('restrictions.displayName.errorKeyword')) ? "is-invalid" : ""}
				autoComplete="off"
			/>
			<label htmlFor="bio">{t('settings.accountPreferences.subSections.profileInformation.bio.title')}</label>
			<BioContainer>
				<TextArea
					id="bio"
					placeholder={t('settings.accountPreferences.subSections.profileInformation.bio.placeholder')}
					value={formData.bio || ""}
					rows="4"
					cols="50"
					onChange={handleChange}
				/>
				<p>{formData?.bio?.length || 0} / 280</p>
			</BioContainer>
		</>
	);
};

export default ProfileInformation;
