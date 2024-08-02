const refreshToken = async () => {
	try {
		const response = await fetch('http://localhost:8000/api/v1/auth/token/refresh', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh: localStorage.getItem('refresh') }),
		});
		if (!response.ok) {
			throw new Error('Refresh Failed.');
		}
		const data = await response.json();
		localStorage.setItem('token', data.access);
		console.log('Refresh successful:', data);
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Refresh Failed.');
	}
};

export default refreshToken;
