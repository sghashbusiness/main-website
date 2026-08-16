/**
 * SGHASH UI — MetricCard
 * Three variants per Prompt Spec §1.4:
 * - dark: "Dark green/black backgrounds with bright green and white text"
 * - white: "Clean White Cards for standard charts, line graphs, and data tables"
 * - mint: "Soft, light green backgrounds for highlighted summary metrics"
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './MetricCard.css';

export default function MetricCard({
  variant = 'white',
  label,
  value,
  unit,
  trend,
  trendLabel,
  icon: Icon,
  children,
  className = '',
}) {
  const trendDir = trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div className={`metric-card metric-card--${variant} ${className}`}>
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        {Icon && <Icon size={18} className="metric-card__icon" />}
      </div>
      <div className="metric-card__value">
        {value}
        {unit && <span className="metric-card__unit">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={`metric-card__trend metric-card__trend--${trendDir}`}>
          <TrendIcon size={14} />
          <span>{Math.abs(trend)}%</span>
          {trendLabel && <span className="metric-card__trend-label">{trendLabel}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
