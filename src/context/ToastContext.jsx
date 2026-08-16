/**
 * SGHASH — Toast Context
 * 
 * Global toast notification system.
 * Architecture Spec §1: "Non-blocking errors utilize a global toast
 * notification system."
 */

import { createContext, useReducer, useCallback, useRef } from 'react';

const TOAST_DURATION = 4000; // 4 seconds auto-dismiss

const initialState = {
  toasts: [],
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    case 'MARK_EXITING':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.payload ? { ...t, isExiting: true } : t
        ),
      };

    case 'CLEAR_ALL':
      return { ...state, toasts: [] };

    default:
      return state;
  }
};

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);
  const counterRef = useRef(0);

  const removeToast = useCallback((id) => {
    // Trigger exit animation first
    dispatch({ type: 'MARK_EXITING', payload: id });
    // Then remove after animation completes
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = TOAST_DURATION) => {
    const id = `toast_${++counterRef.current}_${Date.now()}`;

    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id,
        message,
        type, // 'success' | 'error' | 'warning' | 'info'
        isExiting: false,
        createdAt: Date.now(),
      },
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
