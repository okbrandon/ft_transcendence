import React from "react";
import { BioContainer, FormInput, SubSectionHeading, TextArea } from "../styles/Settings.styled";

const ProfileInformation = ({ error, bioByteLength, formData, handleChange }) => {
	return (
		<>
			<SubSectionHeading>Profile Information</SubSectionHeading>
			<label htmlFor="username">Username</label>
			<FormInput
				type="text"
				id="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				className={error.includes("Username") ? "is-invalid" : ""}
				autoComplete="off"
			/>
			<label htmlFor="displayName">Display Name</label>
			<FormInput
				type="text"
				id="displayName"
				placeholder="Display Name"
				value={formData.displayName || ""}
				onChange={handleChange}
				className={error.includes("Display Name") ? "is-invalid" : ""}
				autoComplete="off"
			/>
			<label htmlFor="bio">Bio</label>
			<BioContainer>
				<TextArea
					id="bio"
					placeholder="Tell us about yourself"
					value={formData.bio || ""}
					rows="4"
					cols="50"
					onChange={handleChange}
				/>
				<p>{bioByteLength} / 280</p>
			</BioContainer>
		</>
	);
};

export default ProfileInformation;
