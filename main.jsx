import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard.jsx';

// Entry point for the React application. This grabs the root
// element in index.html and mounts the App component to it.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
