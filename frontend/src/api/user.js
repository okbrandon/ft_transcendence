import API from './api';
import logger from './logger'

export const formatUserData = user => {
	if (user.displayName === null) {
		user.displayName = user.username;
	}
	if (user.avatarID === 'default' || !user.avatarID) {
		user.avatarID = '/images/default-profile.png';
	}
	if (!user.bannerID) {
		user.bannerID = '/images/default-banner.png';
	}
	return user;
};

export const GetUser = async () => {
	try {
		logger('Getting current user...');
		const res = await API.get(`users/@me/profile`);
		const user = formatUserData(res.data);
		return user;
	} catch (err) {
		console.error(err?.response?.data?.error || 'An error occurred');
		return null;
	}
};

export const GetUserByUsername = async (id) => {
	try {
		logger('Getting user by username...');
		const res = await API.get(`users/${id}/profile`);

		const user = formatUserData(res.data);
		return user;
	} catch (err) {
		console.error(err?.response?.data?.error || 'An error occurred');
		return null;
	}
};

export const GetUsers = async (input) => {
	try {
		const res = await API.get(`users/search?content=${input}`);
		const users = res.data.map(formatUserData);
		return users;
	} catch (err) {
		console.error(err?.response?.data?.error || 'An error occurred');
		return [];
	}
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

export const GetSkin = async (id) => {
	try {
		const res = await API.get(`/users/${id}/settings`);
		const selectedSkinId = res.data.selectedPaddleSkin;
		let selectedSkin = null;

		if (selectedSkinId) {
			const skins = await API.get(`/store/items`);
			selectedSkin = skins.data.find(item => item.itemID === selectedSkinId);
		}

		return selectedSkin?.assetID || null;
	} catch (err) {
		console.error(err?.response?.data?.error || 'An error occurred');
		return null;
	}
}
