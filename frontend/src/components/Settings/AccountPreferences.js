import React, { useState, useRef } from 'react';
import {
	Form,
	FormInput,
	SectionHeading,
	SubSectionHeading,
	SubmitButton
} from './styles/Settings.styled';
import {
	ImagePreview,
	ImagePreviewContainer,
	ImageUploadContainer,
	ImageUploadInput,
	ImageUploadLabel,
	RemoveButton,
	TextArea
} from './styles/Image.styled';
import { GetImage } from '../../api/user';
import API from '../../api/api';

const AccountPreferences = () => {
	const [formData, setFormData] = useState({});
	const [profileImage, setProfileImage] = useState(null);
	const [bannerImage, setBannerImage] = useState(null);
	const profilePictureRef = useRef(null);
	const bannerPictureRef = useRef(null);

	const handleImageChange = (event, type, setImage) => {
		const file = event.target.files[0];

		if (!file) {
			return;
		}

		GetImage(file)
			.then((image) => {
				handleChange({ target: { name: type, value: image } });
				setImage(image);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handleRemoveImage = (type, setImage, inputRef) => {
		setImage(null);
		setFormData(data => {
			const updatedData = { ...data };
			delete updatedData[type];
			return updatedData;
		});

		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(data => ({
			...data,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		API.patch('/users/@me/profile', formData)
			.then(() => {
				console.log('Account Preferences updated successfully with:', formData);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Account Preferences</SectionHeading>
			<SubSectionHeading>Profile Information</SubSectionHeading>
			<FormInput
				type="text"
				name="username"
				placeholder="Username"
				onChange={handleChange}
			/>
			<FormInput
				type="text"
				name="displayName"
				placeholder="Display Name"
				onChange={handleChange}
			/>
			<TextArea
				name="bio"
				placeholder="Tell us about yourself"
				rows="4"
				cols="50"
				onChange={handleChange}
			/>
			<SubSectionHeading>Profile Image & Background</SubSectionHeading>
			<ImageUploadContainer>
				<ImageUploadLabel htmlFor="profile-picture">Profile Picture:</ImageUploadLabel>
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
						"No profile image selected"
					)}
				</ImagePreviewContainer>
				{profileImage && (
					<RemoveButton onClick={() => handleRemoveImage("avatarID", setProfileImage, profilePictureRef)}>
						Remove Image
					</RemoveButton>
				)}
			</ImageUploadContainer>

			<ImageUploadContainer>
				<ImageUploadLabel htmlFor="background-image">Background Image:</ImageUploadLabel>
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
						"No background image selected"
					)}
				</ImagePreviewContainer>
				{bannerImage && (
					<RemoveButton onClick={() => handleRemoveImage("bannerID", setBannerImage, bannerPictureRef)}>
						Remove Image
					</RemoveButton>
				)}
			</ImageUploadContainer>
			<SubSectionHeading>General Preferences</SubSectionHeading>
			<FormInput type="text" placeholder="Language Preference" />
			<SubSectionHeading>Account Management</SubSectionHeading>
			<SubmitButton type="submit">Save Changes</SubmitButton>
		</Form>
	);
};

export default AccountPreferences;
