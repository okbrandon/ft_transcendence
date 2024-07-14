import React from 'react';
import Router from './Router';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <RouterProvider router={Router}/>
  );
}

export default App;
