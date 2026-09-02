import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BranchProvider } from './context/BranchContext';
import App from './App.jsx';
import './index.css';

/**
 * Provider composition order (outermost → innermost):
 * ThemeProvider → ToastProvider → AuthProvider → BranchProvider → Router → App
 * 
 * Theme is outermost so all components can read the theme.
 * Toast is next so auth errors can trigger toasts.
 * Auth wraps Branch so branch context can read user's assigned branch.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BranchProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </BranchProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);

