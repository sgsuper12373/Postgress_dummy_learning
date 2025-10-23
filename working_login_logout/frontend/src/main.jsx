import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Import our new pages and components
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

import './index.css'; // Keep the CSS

// Define our application's routes
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/', // This is the root/home route
    element: (
      <ProtectedRoute>
        {/* This is the protected component */}
        <DashboardPage /> 
      </ProtectedRoute>
    ),
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Tell React to use our router */}
    <RouterProvider router={router} />
  </React.StrictMode>
);