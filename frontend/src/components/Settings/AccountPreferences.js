import React, { useState, useRef, useContext } from 'react';
import {
	BioContainer,
	ErrorMessage,
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
import { AuthContext } from '../../context/AuthContext';

const AccountPreferences = () => {
	const { user } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		username: user.username,
		displayName: user.displayName,
		bio: user.bio,
	});
	const [profileImage, setProfileImage] = useState(user.avatarID);
	const [bannerImage, setBannerImage] = useState(user.bannerID);
	const [bioByteLength, setBioByteLength] = useState(0);
	const [error, setError] = useState('');
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

		if (name === 'bio') {
			const byteSize = new Blob([value]).size;
			if (byteSize <= 280) {
				setBioByteLength(byteSize);
				setFormData(data => ({
					...data,
					[name]: value,
				}));
			}
		} else {
			setFormData(data => ({
				...data,
				[name]: value,
			}));
		}
	};

	const validateForm = () => {
		let errorMessage = '';

		if (formData.username && formData.username.length < 4) {
			errorMessage = 'Username must be at least 4 characters long.';
		} else if (formData.username && formData.username.length > 16) {
			errorMessage = 'Username cannot be longer than 16 chracaters.';
		} else if (formData.displayName && formData.displayName.length > 16) {
			errorMessage = 'Display Name cannot be longer than 16 characters.';
		}
		return errorMessage;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errorMessage = validateForm();

		if (errorMessage) {
			setError(errorMessage);
		} else {
			API.patch('/users/@me/profile', formData)
				.then(() => {
					console.log('Account Preferences updated successfully with:', formData);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Account Preferences</SectionHeading>
			<SubSectionHeading>Profile Information</SubSectionHeading>
			<FormInput
				type="text"
				name="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
			/>
			{error.includes("Username") && <ErrorMessage>{error}</ErrorMessage>}
			<FormInput
				type="text"
				name="displayName"
				placeholder="Display Name"
				value={formData.displayName}
				onChange={handleChange}
			/>
			{error.includes("Display Name") && <ErrorMessage>{error}</ErrorMessage>}
			<BioContainer>
				<TextArea
					name="bio"
					placeholder="Tell us about yourself"
					value={formData.bio}
					rows="4"
					cols="50"
					onChange={handleChange}
				/>
				<p>{bioByteLength} / 280 bytes</p>
			</BioContainer>
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
