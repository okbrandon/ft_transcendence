import React from 'react';
import GlobalStyles from '../styles/global/Global';
import Router from './Router';
import { RouterProvider } from 'react-router-dom';
import NotificationProvider from '../context/NotificationContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-circular-progressbar/dist/styles.css';
import { Suspense } from 'react';
import AuthProvider from '../context/AuthContext';

function App() {
  return (
	<AuthProvider>
		<Suspense fallback="Loading...">
			<NotificationProvider>
			<GlobalStyles/>
			<RouterProvider router={Router}/>
			</NotificationProvider>
		</Suspense>
	</AuthProvider>
  );
}

export default App;
