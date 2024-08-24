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
import Shop from '../components/Shop/Shop';
import Tournament from '../components/Game/Tournament/Tournament';
import JoinTournament from '../components/Game/Tournament/JoinTournament';
import Match from '../components/Game/Match';

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
				<Route path="shop" element={ <Shop/> }/>
				<Route path="playmenu" element={ <PlayMenu/> }/>
				<Route path="tournament" element={ <Tournament/> }/>
				<Route path="tournament-room" element={ <JoinTournament/> }/> {/* ⚒️ testing... */}
				<Route path="vs-ai" element={ <Match/> }/>
			</Route>
		</Route>
		<Route element={ <PrivateRoutes/>}>
			<Route path="solo-vs-ai" element={ <Game/> }/>
		</Route>
		<Route path="*" element={ <Navigate to="/"/> }/>
	</>
));

export default Router;
