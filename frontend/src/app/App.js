import React from 'react';
import GlobalStyles from '../styles/global/Global';
import Router from './Router';
import { RouterProvider } from 'react-router-dom';
import NotificationProvider from '../context/NotificationContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <NotificationProvider>
      <GlobalStyles/>
      <RouterProvider router={Router}/>
    </NotificationProvider>
  );
};

export default App;
