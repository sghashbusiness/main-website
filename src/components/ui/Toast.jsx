/**
 * SGHASH UI — Toast Notification Renderer
 * Renders all active toasts from ToastContext.
 * Architecture Spec §1: "Non-blocking errors utilize a global toast notification system."
 */

import { useToast } from '../../hooks/useToast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.type} ${toast.isExiting ? 'anim-toast-exit' : 'anim-toast-enter'}`}
            role="alert"
          >
            <Icon size={18} className="toast__icon" />
            <span className="toast__message">{toast.message}</span>
            <button
              className="toast__dismiss"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
