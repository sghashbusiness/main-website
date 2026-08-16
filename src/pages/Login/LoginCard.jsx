/**
 * SGHASH UI — Login Card
 * Standard login form handling auth state and validation.
 */

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import GlassCard from '../../components/ui/GlassCard';
import InputField from '../../components/ui/InputField';
import PasswordInput from '../../components/ui/PasswordInput';
import PillButton from '../../components/ui/PillButton';
import { User, Lock, ArrowRight } from 'lucide-react';
import './Login.css'; // Shared styles for Login module

export default function LoginCard({ onFlipToRecovery }) {
  const { login } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setError(null);
    setIsLoading(true);

    const result = await login(identifier, password, rememberMe);

    if (result.success) {
      toastSuccess(`Welcome back, ${result.data.user.displayName}`);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const isFormValid = identifier.trim().length > 0 && password.length > 0;

  return (
    <GlassCard className="login-card login-card--light">
      <div className="login-card__header">
        <div className="login-card__logo-wrapper">
          <img src="/sghash-green-logo.png" alt="SGHASH Icon" className="login-card__logo-icon" />
          <img src="/sghash-logo-text-new.png" alt="SGHASH ONE" className="login-card__logo-text" />
        </div>
        <div className="login-card__brand-subtitle">
          <span className="login-card__brand-line"></span>

          <span className="login-card__brand-line"></span>
        </div>
        <p className="login-card__subtitle">Sign in to your SGHASH workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="login-card__form">
        <InputField
          label={null}
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Username or Email"
          icon={User}
          autoFocus
          disabled={isLoading}
        />

        <PasswordInput
          label={null}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={Lock}
          disabled={isLoading}
        />

        {error && <div className="login-card__error">{error}</div>}

        <div className="login-card__options">
          <label className="login-card__checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="login-card__checkbox"
            />
            <span className="login-card__checkbox-text">Remember me</span>
          </label>
          <button
            type="button"
            className="login-card__text-btn"
            onClick={onFlipToRecovery}
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="login-card__submit-btn"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit'}
          {!isLoading && <ArrowRight size={20} className="login-card__submit-icon" />}
        </button>
      </form>
    </GlassCard>
  );
}
