/**
 * SGHASH UI — PillButton
 * "Solid dark pill button" per Architecture Spec §2.1.
 * Variants: primary, secondary, danger, ghost.
 */

import Spinner from './Spinner';
import './PillButton.css';

export default function PillButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`pill-btn pill-btn--${variant} pill-btn--${size} ${fullWidth ? 'pill-btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Spinner size={size === 'sm' ? 14 : 18} color="currentColor" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 18} />}
      {children && <span className="pill-btn__label">{children}</span>}
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 18} />}
    </button>
  );
}
