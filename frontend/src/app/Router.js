import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom';
import { isValidToken } from '../api/api';
import Root from '../components/Root';
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
import Game from '../components/Game/Game';
import Home from '../components/Home/Home';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProfileParent } from '../components/Profile/Profile';

const PrivateRoutes = () => {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

	setIsLoggedIn(isValidToken());

	return (
		isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
	);
};

const Router = createBrowserRouter(createRoutesFromElements(
	<>
		<Route path="/" element={ <Root/> }>
			<Route index element={ <Home/> }/>
			<Route path="login" element={ <Login/> }/>
			<Route path="signup" element={ <SignUp/> }/>
			<Route element={ <PrivateRoutes/> }>
				<Route path="profile" element={ <ProfileParent/> }/>
			</Route>
		</Route>
		<Route element={ <PrivateRoutes/>}>
			<Route path="solo-vs-ai" element={ <Game/> }/>
		</Route>
		<Route path="*" element={ <Navigate to="/"/> }/>
	</>
));

export default Router;
