import React from 'react';
import { AuthenticationContainer } from '../../styles/Authentication.styled';
import Login from './Login';
import SignUp from './SignUp';

const Authentication = () => {
	const [isSignIn, setIsSignIn] = useState(true);

	const handleToggle = () => {
		setIsSignIn(!isSignIn);
	};

	return (
		<AuthenticationContainer>
			{
				isSignIn ? (
					<Login handleToggle={handleToggle}/>
				) : (
					<SignUp handleToggle={handleToggle}/>
				)
			}
		</AuthenticationContainer>
	);
};

export default Authentication;
