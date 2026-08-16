/**
 * SGHASH UI — Spinner
 * Inline loading spinner per Architecture Spec §2.1.
 */

import './Spinner.css';

export default function Spinner({ size = 20, color, className = '' }) {
  return (
    <div
      className={`spinner anim-spinner ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: color ? `${color}33` : undefined,
        borderTopColor: color || undefined,
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
