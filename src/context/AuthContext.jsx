/**
 * SGHASH — Authentication Context
 * 
 * Global auth state: user, role, branch, isAuthenticated.
 * Manages login, logout, and session persistence ("Remember Me").
 * 
 * Architecture Spec §1: "The authentication token dictates the UI render path,
 * hiding tenant IDs and complex URLs from the end-user."
 */

import { createContext, useReducer, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AUTH_STORAGE_KEY = 'sghash_auth_token';

const initialState = {
  user: null,
  role: null,
  branch: null,
  isAuthenticated: false,
  isLoading: true, // true until initial token validation completes
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.user.role,
        branch: action.payload.user.branch,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        role: null,
        branch: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!token) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      const result = await authService.validateToken(token);
      if (result.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: result.data });
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (identifier, password, rememberMe = false) => {
    dispatch({ type: 'AUTH_LOADING' });

    const result = await authService.login(identifier, password);

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, result.data.token);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, result.data.token);
      }
      dispatch({ type: 'AUTH_SUCCESS', payload: result.data });
      return result;
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: result.error });
      return result;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
