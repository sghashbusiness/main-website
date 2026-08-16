/**
 * SGHASH UI — SegmentedToggle
 * Per Architecture Spec §3.1: "Segmented pill toggle"
 * Used for TimePeriodSelector and InvoiceDeliveryToggle.
 */

import './SegmentedToggle.css';

export default function SegmentedToggle({ options, value, onChange, size = 'md', className = '' }) {
  return (
    <div className={`seg-toggle seg-toggle--${size} ${className}`} role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          className={`seg-toggle__item ${value === opt.value ? 'seg-toggle__item--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <opt.icon size={14} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
