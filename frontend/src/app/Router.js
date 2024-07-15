import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../components/Root';
import Authentication from '../features/authentication/Authentication';
import Login from '../features/authentication/Login';
import SignUp from '../features/authentication/SignUp';

const Router = createBrowserRouter(createRoutesFromElements(
	<Route path="/" element={ <Root/> }>
		<Route index element={ <Authentication/> }/>
		<Route path="login" element={ <Login/> }/>
		<Route path="signup" element={ <SignUp/> }/>
	</Route>
));

export default Router;