import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { store } from './_store';
import App from './App';
import './index.css';

// setup fake backend
 import fakeBackend from './_utils/fake-backend';
 fakeBackend();

const router = createBrowserRouter(
  [
    {
      path: '/*',
      element: <App />,
    },
    // Add other routes here
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: false,
    },
  }
);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);