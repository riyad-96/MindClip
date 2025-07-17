import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import NotFound from './pages/NotFound.jsx';
import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Notes from './components/Notes.jsx';
import Trash from './components/Trash.jsx';
import ContextProviders from './contexts/ContextProviders.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: 'notes',
            element: <Notes />,
          },
          {
            path: 'trash',
            element: <Trash />,
          },
        ],
      },
      {
        path: 'auth',
        element: <Auth />,
        children: [
          {
            path: 'log-in',
            element: <Login />,
          },
          {
            path: 'create-account',
            element: <Signup />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProviders>
      <RouterProvider router={router} />
    </ContextProviders>
  </StrictMode>,
);
