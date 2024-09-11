import React from 'react';
import { AuthenticationContainer } from './styles/Authentication.styled';
import SignIn from './SignIn';
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
					<SignIn handleToggle={handleToggle}/>
				) : (
					<SignUp handleToggle={handleToggle}/>
				)
			}
		</AuthenticationContainer>
	);
};

export default Authentication;
