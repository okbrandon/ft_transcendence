import API from './api';

export const GetUser = async () => {
	console.log('Getting current user...');
	return await API.get('users/@me/profile');
};

export const GetUserByUsername = async (username) => {
	console.log('Getting user by username...');
	return await API.get(`users/${username}/profile`);
};

export const GetUsers = async (input) => {
	console.log('Getting users via search bar...');
	return await API.get(`users/search?content=${input}`);
}

export const GetImage = async (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			const base64String = reader.result;

			// Check if it's a valid base64 image string
			const base64Regex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
			if (!base64Regex.test(base64String)) {
				return reject('Invalid Base64 encoded image.');
			}

			// Calculate the Base64 size
			const base64Data = base64String.split(',')[1]; // Extract the actual Base64 data
			const fileSizeInBytes = (base64Data.length * 3) / 4 - (base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0);

			// Convert bytes to megabytes
			const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

			// Check if the image size exceeds 1MB
			if (fileSizeInMB > 1) {
				return reject('Image is larger than 1MB.');
			}

			// If it's valid and under 1MB, resolve the Base64 string
			resolve(base64String);
		};

		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	});
}
