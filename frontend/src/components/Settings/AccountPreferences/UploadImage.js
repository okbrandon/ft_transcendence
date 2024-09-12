import React, { useState, useRef } from 'react';
import {
	ImagePreview,
	ImagePreviewContainer,
	ImageUploadContainer,
	ImageUploadInput,
	ImageUploadLabel,
	RemoveButton,
} from '../styles/UploadImage.styled';
import { GetImage } from '../../../api/user';

const ImageSettings = ({ user, setFormData, handleChange }) => {
	const [profileImage, setProfileImage] = useState(user.avatarID);
	const [bannerImage, setBannerImage] = useState(user.bannerID);
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

	return (
		<>
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
		</>
	);
};

export default ImageSettings;
