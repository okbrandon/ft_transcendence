import React from 'react';
import GlobalStyles from '../components/styles/global/Global';
import Router from './Router';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <>
      <GlobalStyles/>
      <RouterProvider router={Router}/>
    </>
  );
};

export default App;
