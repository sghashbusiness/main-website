/**
 * SGHASH UI — Password Recovery Card
 * 3-state flow: Request OTP -> Verify OTP -> Reset Password.
 */

import { useState } from 'react';
import { requestPasswordResetOTP, verifyOTP, resetPassword } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import GlassCard from '../../components/ui/GlassCard';
import InputField from '../../components/ui/InputField';
import PasswordInput from '../../components/ui/PasswordInput';
import OtpInput from '../../components/ui/OtpInput';
import PillButton from '../../components/ui/PillButton';
import { Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import './Login.css';

export default function PasswordRecoveryCard({ onCancel }) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [step, setStep] = useState(1); // 1: Request, 2: Verify, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [resetToken, setResetToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setIsLoading(true);
    
    const result = await requestPasswordResetOTP(email);
    
    setIsLoading(false);
    if (result.success) {
      toastSuccess(result.data.message);
      setStep(2);
    } else {
      setError(result.error);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setError(null);
    setIsLoading(true);

    const result = await verifyOTP(email, otp);

    setIsLoading(false);
    if (result.success) {
      setResetToken(result.data.resetToken);
      setStep(3);
    } else {
      setError(result.error);
      setOtp(''); // Clear invalid OTP
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await resetPassword(email, resetToken, newPassword);

    setIsLoading(false);
    if (result.success) {
      toastSuccess(result.data.message);
      onCancel(); // Return to login
    } else {
      setError(result.error);
    }
  };

  return (
    <GlassCard className="login-card login-card--recovery">
      <div className="login-card__header">
        <h2 className="login-card__title" style={{ fontSize: 'var(--font-size-xl)' }}>
          Account Recovery
        </h2>
        <p className="login-card__subtitle">
          {step === 1 && 'Enter your registered email address.'}
          {step === 2 && 'Enter the 6-digit OTP sent to your email.'}
          {step === 3 && 'Create a new secure password.'}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestOTP} className="login-card__form anim-fade-in-scale">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@sghash.in"
            icon={Mail}
            autoFocus
            disabled={isLoading}
          />
          {error && <div className="login-card__error">{error}</div>}
          <div className="login-card__actions mt-4">
            <button type="button" className="login-card__text-btn" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
            <PillButton type="submit" loading={isLoading} disabled={!email.trim() || isLoading} icon={ArrowRight} iconPosition="right">
              Send OTP
            </PillButton>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="login-card__form anim-fade-in-scale">
          <InputField
            label="Email Address"
            value={email}
            icon={Mail}
            disabled
            readOnly
          />
          <div className="login-card__otp-wrap">
            <label className="input-field__label">Verification Code</label>
            <OtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              error={error}
            />
          </div>
          <div className="login-card__actions mt-4">
            <button type="button" className="login-card__text-btn" onClick={() => setStep(1)} disabled={isLoading}>
              Change Email
            </button>
            <PillButton type="submit" loading={isLoading} disabled={otp.length < 6 || isLoading} icon={CheckCircle} iconPosition="right">
              Verify
            </PillButton>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="login-card__form anim-fade-in-scale">
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoFocus
            disabled={isLoading}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Retype new password"
            disabled={isLoading}
          />
          {error && <div className="login-card__error">{error}</div>}
          <div className="login-card__actions mt-4">
            <button type="button" className="login-card__text-btn" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
            <PillButton type="submit" loading={isLoading} disabled={!newPassword || !confirmPassword || isLoading} icon={Lock} iconPosition="left">
              Reset Password
            </PillButton>
          </div>
        </form>
      )}
    </GlassCard>
  );
}
