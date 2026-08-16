import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BranchProvider } from './context/BranchContext';
import App from './App.jsx';
import './index.css';

/**
 * Provider composition order (outermost → innermost):
 * ToastProvider → AuthProvider → BranchProvider → Router → App
 * 
 * Toast is outermost so auth errors can trigger toasts.
 * Auth wraps Branch so branch context can read user's assigned branch.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <BranchProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BranchProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
