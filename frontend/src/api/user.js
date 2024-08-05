const GetUser = async () => {
	try {
		console.log('Getting user...');

		const response = await fetch('http://localhost:8000/api/v1/users/@me/profile', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
			},
		});

		if (!response.ok) {
			throw new Error('An error occurred while getting user.');
		}

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export default GetUser;
