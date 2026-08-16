/**
 * SGHASH UI — GlassCard
 * Prompt Spec: "glassmorphic effect using backdrop-filters" for Login background.
 */

import './GlassCard.css';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div className={`glass-card ${className}`} {...props}>
      {children}
    </div>
  );
}
