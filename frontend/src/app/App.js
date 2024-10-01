import React from 'react';
import GlobalStyles from '../styles/global/Global';
import Router from './Router';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense } from 'react';

function App() {
  return (
    <>
      <GlobalStyles/>
      <RouterProvider router={Router}/>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Suspense fallback="Loading...">
      <App/>
    </Suspense>
  );
}
