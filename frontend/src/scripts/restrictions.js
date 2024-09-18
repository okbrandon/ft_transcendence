import logger from '../api/logger';

export const checkSignUpRestrictions = (data, cfPassword) => {
	if (!data) {
		logger('checkRestrictions: No data');
		return '';
	}

	// else if (lang.length !== 2 || !['en', 'fr', 'es'].includes(lang)) {
	// 	errorMessage = 'Unsupported language, must be either "en", "fr", or "es".';

	if (!data.username) { // username
		return 'Username is required.';
	} else if (data.username.length < 4 || data.username.length > 16) {
		return 'Username must be 4-16 characters long.';
	} else if (/[^a-zA-Z0-9]/.test(data.username)) {
		return 'Username must contain only alphanumeric characters.';
	} else if (!data.email) { // email
		return 'Email is required.';
	} else if (data.email.length > 64) {
		return 'Email cannot be longer than 64 characters.';
	} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
		return 'Invalid Email address, did not match the required format.';
	} else if (!data.password) { // password
		return 'Password is required.';
	} else if (new TextEncoder().encode(data.password).length < 8 || new TextEncoder().encode(data.password).length > 72) {
		return 'Password must be 8-72 characters long.';
	} else if (!/[a-z]/.test(data.password)) {
		return 'Password must contain at least one lowercase letter.';
	} else if (!/[A-Z]/.test(data.password)) {
		return 'Password must contain at least one uppercase letter.';
	} else if (!/\d/.test(data.password)) {
		return 'Password must contain at least one digit.';
	} else if (!/[\W_]/.test(data.password)) {
		return 'Password must contain at least one special character.';
	} else if (data.password !== cfPassword) {
		return 'Passwords do not match.';
	}

	return '';
};

export const checkAccountPreferencesRestrictions = (data) => {
	if (!data) {
		logger('checkRestrictions: No data');
		return '';
	}

	if (!data.username) { // username
		return 'Username is required.';
	} else if (data.username.length < 4 || data.username.length > 16) {
		return 'Username must be 4-16 characters long.';
	} else if (/[^a-zA-Z0-9]/.test(data.username)) {
		return 'Username must contain only alphanumeric characters.';
	} else if (data.displayName && (data.displayName.length < 4 || data.displayName.length > 16)) {
		return 'Display Name must be 4-16 characters long.';
	} else if (/[^a-zA-Z0-9]/.test(data.displayName)) {
		return 'Display Name must contain only alphanumeric characters or null.';
	}

	return '';
};

export const checkSecurityRestrictions = (data, cfPassword) => {
	if (!data) {
		logger('checkRestrictions: No data');
		return '';
	}

	if (data.password && (new TextEncoder().encode(data.password).length < 8 || new TextEncoder().encode(data.password).length > 72)) {
		return 'Password must be 8-72 characters long.';
	} else if (data.password && !data.otp) {
		return 'OTP is required to change password when MFA is enabled.';
	} else if (data.password && !/[a-z]/.test(data.password)) {
		return 'Password must contain at least one lowercase letter.';
	} else if (data.password && !/[A-Z]/.test(data.password)) {
		return 'Password must contain at least one uppercase letter.';
	} else if  (data.password && !/\d/.test(data.password)) {
		return 'Password must contain at least one digit.';
	} else if (data.password && !/[\W_]/.test(data.password)) {
		return 'Password must contain at least one special character.';
	} else if (data.password && data.password !== cfPassword) {
		return 'Passwords do not match.';
	} else if (!data.email) {
		return 'Email is required.';
	} else if (data.email.length > 64) {
		return 'Email cannot be longer than 64 characters.';
	} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
		return 'Invalid Email address, did not match the required format.';
	} else if (data.phone_number && !/^\+[1-9]\d{1,14}$/.test(data.phone_number)) {
		return 'Phone number must be in E.164 format (e.g., +1234567890).';
	}

	return '';
};
