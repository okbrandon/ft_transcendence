import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../components/shared/Root';
import RootHome from '../components/shared/RootHome';
import Authentication from '../components/features/Authentication/Authentication';
import Login from '../components/features/Authentication/Login';
import SignUp from '../components/features/Authentication/SignUp';
import Callback from '../components/features/Authentication/Callback';
import MainMenu from '../components/features/Menu/MainMenu';
import PlayMenu from '../components/features/Menu/PlayMenu';
import Game from '../components/features/Game/Game';

const Router = createBrowserRouter(createRoutesFromElements(
	<Route path="/" element={ <Root/> }>
		<Route index element={ <Authentication/> }/>
		<Route path="login" element={ <Login/> }/>
		<Route path="callback" element={ <Callback /> }/>
		<Route path="signup" element={ <SignUp/> }/>
		<Route path="home" element={ <RootHome/> }>
			<Route index element={ <MainMenu/> }/>
			<Route path="game" element={ <PlayMenu/> }/>
		</Route>
		<Route path="solo-vs-ai" element={ <Game/> }/>
	</Route>
));

export default Router;
