import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom';
import { isLoggedIn } from '../api/api';
import Root from '../components/Root';
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import Profile from '../components/Profile/Profile';
import Game from '../components/Game/Game';
import Home from '../components/Home/Home';

const PrivateRoutes = () => {
	return (
		isLoggedIn() ? <Outlet/> : <Navigate to="/login"/>
	);
};

const Router = createBrowserRouter(createRoutesFromElements(
	<>
		<Route path="/" element={ <Root/> }>
			<Route index element={ <Home/> }/>
			<Route path="login" element={ <Login/> }/>
			<Route path="signup" element={ <SignUp/> }/>
			<Route element={ <PrivateRoutes/> }>
				<Route path="profile" element={ <Profile/> }/>
			</Route>
		</Route>
		<Route element={ <PrivateRoutes/>}>
			<Route path="solo-vs-ai" element={ <Game/> }/>
		</Route>
		<Route path="*" element={ <Navigate to="/"/> }/>
	</>
));

export default Router;
