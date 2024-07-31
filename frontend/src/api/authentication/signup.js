const signup = async(username, email, password) => {
	try {
		const response = await fetch('http://localhost:8000/api/v1/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, email, password, lang: 'fr' }),
		});
		if (!response.ok) {
			throw new Error('Signup Failed.');
		}
		return 'success';
	} catch (error) {
		console.error('Error signing up:', error);
		throw new Error('Signup Failed.');
	}
};

export default signup;
