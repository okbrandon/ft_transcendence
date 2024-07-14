import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../components/Root';
import Authentication from '../features/authentication';

const Router = createBrowserRouter(createRoutesFromElements(
	<Route path="/" element={ <Root/> }>
		<Route index element={ <Authentication/> }/>
	</Route>
));

export default Router;