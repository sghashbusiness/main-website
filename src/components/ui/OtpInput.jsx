/**
 * SGHASH UI — OtpInput
 * Architecture Spec §2.2: "<AnimatedOtpBlock> reveals a 6-digit OTP input array."
 * Auto-advance on digit entry, backspace moves to previous field.
 */

import { useRef, useCallback } from 'react';
import './OtpInput.css';

export default function OtpInput({ length = 6, value = '', onChange, error, disabled = false, className = '' }) {
  const inputRefs = useRef([]);
  const digits = value.split('').concat(Array(length - value.length).fill(''));

  const focusInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handleChange = useCallback((index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const newValue = newDigits.join('').slice(0, length);
    onChange(newValue);

    // Auto-advance to next field
    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  }, [digits, length, onChange]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  }, [digits, length]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    focusInput(Math.min(pasted.length, length - 1));
  }, [length, onChange]);

  return (
    <div className={`otp-input ${error ? 'otp-input--error' : ''} ${className}`}>
      <div className="otp-input__group">
        {digits.slice(0, length).map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={disabled}
            className="otp-input__digit"
            aria-label={`Digit ${i + 1}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <span className="otp-input__error">{error}</span>}
    </div>
  );
}
