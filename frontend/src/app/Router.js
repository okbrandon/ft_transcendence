import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet } from 'react-router-dom';
import Root from '../components/shared/Root';
import RootHome from '../components/shared/RootHome';
import Authentication from '../components/features/Authentication/Authentication';
import Login from '../components/features/Authentication/Login';
import SignUp from '../components/features/Authentication/SignUp';
import MainMenu from '../components/features/Menu/MainMenu';
import PlayMenu from '../components/features/Menu/PlayMenu';
import Game from '../components/features/Game/Game';
import Profile from '../components/features/Profile/Profile';
import { isLoggedIn } from '../api/api';

const PrivateRoutes = () => {
	return (
		isLoggedIn() ? <Outlet/> : <Navigate to="/login"/>
	);
};

const Router = createBrowserRouter(createRoutesFromElements(
	<Route path="/" element={ <Root/> }>
		<Route index element={ <Authentication/> }/>
		<Route path="login" element={ <Login/> }/>
		<Route path="signup" element={ <SignUp/> }/>
		<Route element={ <PrivateRoutes/>}>
			<Route path="home" element={ <RootHome/> }>
				<Route index element={ <MainMenu/> }/>
				<Route path="game" element={ <PlayMenu/> }/>
			</Route>
			<Route path="profile" element={ <Profile/> }/>
			<Route path="solo-vs-ai" element={ <Game/> }/>
		</Route>
	</Route>
));

export default Router;
