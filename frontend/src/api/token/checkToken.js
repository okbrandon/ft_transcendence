const checkToken = async () => {
	if (!localStorage.getItem('token')) {
		console.log('No token found.');
		throw new Error('No token found.');
	}
	const response = await fetch('http://localhost:8000/api/v1/users/@me/profile', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('token'),
		},
	});
	if (response.status !== 200) {
		console.log('Token invalid:', response.status);
		throw new Error('Token invalid.');
	}
	console.log('Token valid:', response.status);
};

export default checkToken;
