/**
 * SGHASH UI — PasswordInput
 * Architecture Spec §2.1: "Standard masked field including an inline
 * <EyeIconButton> (visibility toggle) and a <CapsLockWarning> indicator."
 */

import { useState, useCallback } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import InputField from './InputField';
import './PasswordInput.css';

export default function PasswordInput({
  label = 'Password',
  value,
  onChange,
  error,
  placeholder = 'Enter password',
  autoFocus = false,
  id,
  name,
  className = '',
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const handleKeyDown = useCallback((e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  }, []);

  const handleKeyUp = useCallback((e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  }, []);

  return (
    <div className={`password-input ${className}`}>
      <InputField
        label={label}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        autoFocus={autoFocus}
        id={id}
        name={name}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        rightElement={
          <button
            type="button"
            className="password-input__toggle"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...props}
      />
      {capsLock && (
        <div className="password-input__caps-warning">
          <AlertTriangle size={12} />
          <span>Caps Lock is on</span>
        </div>
      )}
    </div>
  );
}
