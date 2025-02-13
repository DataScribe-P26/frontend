import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './utils/AuthContext';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import './index.css';

const clientId = "849832574401-u80ur1j46qvdt7lr9lnatak8h6koj3l4.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Router> {/* ✅ Moved Router above AuthProvider */}
        <AuthProvider> {/* ✅ Now inside Router */}
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
