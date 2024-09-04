import React, { useState } from "react";
import {
	Form,
	FormInput,
	SectionHeading,
	SubmitButton
} from "./styles/Settings.styled";
import API from "../../api/api";

const Security = () => {
	const [formData, setFormData] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(data => ({
			...data,
			[name]: value,
		}));
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		API.patch('/users/@me/profile', formData)
			.then(() => {
				console.log('Security updated successfully with:', formData);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	return (
		<Form onSubmit={handleSubmit}>
			<SectionHeading>Security</SectionHeading>
			<FormInput
				type="password"
				name="password"
				placeholder="Change Password"
				onChange={handleChange}
			/>
			<FormInput
				type="email"
				name="email"
				placeholder="Change Email"
				onChange={handleChange}
			/>
			<SubmitButton>Save Changes</SubmitButton>
		</Form>
	);
};

export default Security;
