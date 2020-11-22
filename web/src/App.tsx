import React from 'react';
import Routes from './routes';
import './styles/global.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;