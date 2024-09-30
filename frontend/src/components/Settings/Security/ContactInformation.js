import React from "react";
import { FormInput, SubSectionHeading } from "../styles/Settings.styled";

const ContactInformation = ({ error, formData, handleChange }) => {
	return (
		<>
			<SubSectionHeading>Contact Information</SubSectionHeading>
			<label htmlFor="email">Email</label>
			<FormInput
				type="email"
				id="email"
				placeholder="Change Email"
				value={formData.email}
				onChange={handleChange}
				className={error.includes("Email") ? "is-invalid" : ""}
				autoComplete="email"
			/>
			<label htmlFor="phone_number">Phone Number</label>
			<FormInput
				type="tel"
				id="phone_number"
				placeholder="Add Phone Number"
				value={formData.phone_number}
				onChange={handleChange}
				className={error.includes("Phone number") ? "is-invalid" : ""}
				autoComplete="tel"
			/>
		</>
	);
};

export default ContactInformation;
