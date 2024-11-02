import React, { useState, useRef, useCallback } from 'react';
import {
	ImagePreview,
	ImagePreviewContainer,
	ImageUploadContainer,
	ImageUploadInput,
	ImageUploadLabel,
} from '../styles/ProfileImage.styled';
import { SubSectionHeading } from '../styles/Settings.styled';
import { getImage } from '../../../api/user';
import PongButton from '../../../styles/shared/PongButton.styled';
import ErrorMessage from '../../../styles/shared/ErrorMessage.styled';
import { useNotification } from '../../../context/NotificationContext';
import { useTranslation } from 'react-i18next';

const ImageSettings = ({ user, setFormData, handleChange }) => {
	const { addNotification } = useNotification();
	const [profileImage, setProfileImage] = useState(user.avatarID);
	const [bannerImage, setBannerImage] = useState(user.bannerID);
	const [error, setError] = useState('');
	const profilePictureRef = useRef(null);
	const bannerPictureRef = useRef(null);
	const { t } = useTranslation();

	const handleImageChange = useCallback((event, type, setImage) => {
		const file = event.target.files[0];

		if (!file) {
			return;
		}

		getImage(file)
			.then(image => {
				setError('');
				handleChange({ target: { id: type, value: image } });
				setImage(image);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
			});
	}, [addNotification, handleChange]);

	const handleRemoveImage = useCallback((type, setImage, inputRef) => {
		setImage(null);
		setFormData(data => (
			{ ...data, [type]: null }
		))
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	}, [setFormData]);

	return (
		<>
			<SubSectionHeading>{t('settings.accountPreferences.subSections.profileImage.title')}</SubSectionHeading>
			<ImageUploadContainer>
					<ImageUploadLabel htmlFor="profile-picture">{t('settings.accountPreferences.subSections.profileImage.profilePicture.title')}</ImageUploadLabel>
					<ImageUploadInput
						type="file"
						id="profile-picture"
						accept="image/*"
						onChange={(e) => handleImageChange(e, "avatarID", setProfileImage)}
						ref={profilePictureRef}
					/>
					<ImagePreviewContainer className="profile-picture">
						{profileImage ? (
							<ImagePreview src={profileImage} alt="Profile Preview" />
						) : (
							t('settings.accountPreferences.subSections.profileImage.profilePicture.noImage')
						)}
					</ImagePreviewContainer>
					{profileImage && (
						<PongButton onClick={() => handleRemoveImage("avatarID", setProfileImage, profilePictureRef)}>
							{t('settings.accountPreferences.subSections.profileImage.profilePicture.removeButton')}
						</PongButton>
					)}
				</ImageUploadContainer>
				<ImageUploadContainer>
					<ImageUploadLabel htmlFor="background-image">{t('settings.accountPreferences.subSections.profileImage.backgroundImage.title')}</ImageUploadLabel>
					<ImageUploadInput
						type="file"
						id="background-image"
						accept="image/*"
						onChange={(e) => handleImageChange(e, "bannerID", setBannerImage)}
						ref={bannerPictureRef}
					/>
					<ImagePreviewContainer className="banner-picture">
						{bannerImage ? (
							<ImagePreview src={bannerImage} alt="Background Preview" />
						) : (
							t('settings.accountPreferences.subSections.profileImage.backgroundImage.noImage')
						)}
					</ImagePreviewContainer>
					{bannerImage && (
						<PongButton onClick={() => handleRemoveImage("bannerID", setBannerImage, bannerPictureRef)}>
							{t('settings.accountPreferences.subSections.profileImage.backgroundImage.removeButton')}
						</PongButton>
					)}
				</ImageUploadContainer>
				{error && <ErrorMessage>{error}</ErrorMessage>}
		</>
	);
};

export default ImageSettings;
