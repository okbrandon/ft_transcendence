const login = async (username, password) => {
	try {
		const response = await fetch('http://localhost:8000/api/v1/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		if (!response.ok) {
			throw new Error('Login Failed.');
		}
		const data = await response.json();
		localStorage.setItem('token', data.access);
		localStorage.setItem('refresh', data.refresh);
		console.log('Login successful:', data);
		return data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw new Error('Login Failed.');
	}
};

export default login;
