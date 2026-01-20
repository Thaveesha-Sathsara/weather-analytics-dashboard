import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import Dashboard from './Dashboard';

function App() {
  return (
    <Auth0Provider
      domain="dev-b5yr0mxjii1hhmuo.us.auth0.com" // Replace with your Auth0 Domain
      clientId="6EzgaiPbCp0VQKi9XYlBwnY7DJhj4ntE" // Replace with your Client ID
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://weather-api" // Must match your server's audience
      }}
    >
      <Dashboard />
    </Auth0Provider>
  );
}

export default App;