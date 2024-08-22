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
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProfileParent } from '../components/Profile/Profile';
import Verify from '../components/Auth/Verify';
import Callback from '../components/Auth/Callback';
import PlayMenu from '../components/Game/PlayMenu';
import Store from '../components/Store/Store';
import Tournament from '../components/Game/Tournament/Tournament';

const PrivateRoutes = () => {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		setIsLoggedIn(isValidToken());
	}, [setIsLoggedIn]);

	return (
		isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
	);
};

const Router = createBrowserRouter(createRoutesFromElements(
	<>
		<Route path="/" element={ <Root/> }>
			<Route index element={ <Home/> }/>
			<Route path="login" element={ <Login/> }/>
			<Route path="callback" element={ <Callback/> }/>
			<Route path="verify" element={ <Verify/> }/>
			<Route path="signup" element={ <SignUp/> }/>
			<Route element={ <PrivateRoutes/> }>
				<Route path="profile/:username" element={ <ProfileParent/> }/>
				<Route path="store" element={ <Store/> }/>
				<Route path="playmenu" element={ <PlayMenu/> }/>
				<Route path="tournament" element={ <Tournament/> }/>
			</Route>
		</Route>
		<Route element={ <PrivateRoutes/>}>
			<Route path="solo-vs-ai" element={ <Game/> }/>
		</Route>
		<Route path="*" element={ <Navigate to="/"/> }/>
	</>
));

export default Router;
