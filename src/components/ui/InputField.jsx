/**
 * SGHASH UI — InputField
 * Strict inline red-text validation per Architecture Spec §1.
 */

import './InputField.css';

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  icon: Icon,
  rightElement,
  id,
  name,
  className = '',
  ...props
}) {
  const fieldId = id || name || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${disabled ? 'input-field--disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="input-field__label">
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      <div className="input-field__wrapper">
        {Icon && <Icon size={18} className="input-field__icon" />}
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          name={name}
          className="input-field__input"
          {...props}
        />
        {rightElement && <div className="input-field__right">{rightElement}</div>}
      </div>
      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
}
