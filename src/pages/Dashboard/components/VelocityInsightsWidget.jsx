import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import Spinner from '../../../components/ui/Spinner';
import { TrendingUp, AlertOctagon } from 'lucide-react';

export default function VelocityInsightsWidget() {
  const { selectedBranch, timePeriod } = useBranch();
  const [loading, setLoading] = useState(true);

  // Mock data for velocity
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    // Simulate API fetch
    setTimeout(() => {
      if (isMounted) {
        setData({
          topMovers: [
            { sku: 'SAM-S24U-256', name: 'S24 Ultra', qty: 45 },
            { sku: 'APL-IP15-128', name: 'iPhone 15', qty: 38 },
            { sku: 'OP-12-256', name: 'OnePlus 12', qty: 29 },
          ],
          deadStock: 14 // High value units sitting 60+ days
        });
        setLoading(false);
      }
    }, 400);

    return () => { isMounted = false; };
  }, [selectedBranch, timePeriod]);

  if (loading) {
    return (
      <div className="metric-card flex-center" style={{ height: '100%' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="metric-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
        <TrendingUp size={20} color="var(--color-primary-light)" />
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Velocity Insights</h3>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {data.topMovers.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border-light)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-panel-text)' }}>{item.name}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{item.sku}</div>
            </div>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-success)' }}>
              {item.qty} <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>sold</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-danger-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <AlertOctagon size={24} color="var(--color-danger)" />
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-danger)' }}>Dead Stock Warning</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>{data.deadStock} high-value units (60+ days)</div>
        </div>
      </div>
    </div>
  );
}
