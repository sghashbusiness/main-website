/**
 * SGHASH — SalesAnalytics
 * Renders the top 4 MetricCards.
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { getMetrics, getConsolidated } from '../../../services/analyticsService';
import MetricCard from '../../../components/ui/MetricCard';
import { IndianRupee, FileText, ShoppingBag, Tag } from 'lucide-react';
import Spinner from '../../../components/ui/Spinner';

export default function SalesAnalytics() {
  const { selectedBranch, timePeriod } = useBranch();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      // If custom is selected, we simulate by defaulting to monthly for the mock
      const effectivePeriod = timePeriod === 'custom' ? 'monthly' : timePeriod;
      
      let res;
      if (selectedBranch === 'all') {
        res = await getConsolidated(effectivePeriod);
      } else {
        res = await getMetrics(selectedBranch, effectivePeriod);
      }
      
      if (isMounted) {
        if (res.success && res.data) {
          setMetrics(res.data);
        } else {
          setError(res.error || 'No data available');
        }
        setLoading(false);
      }
    };

    fetchMetrics();
    return () => { isMounted = false; };
  }, [selectedBranch, timePeriod]);

  if (loading) {
    return (
      <div className="flex-center" style={{ gridColumn: 'span 2', height: 200 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div style={{ gridColumn: 'span 2', padding: 'var(--space-lg)', color: 'var(--color-danger)', background: 'var(--color-danger-subtle)', borderRadius: 'var(--radius-md)' }}>
        {error || 'Unable to load metrics'}
      </div>
    );
  }

  return (
    <>
      <MetricCard
        variant="dark"
        label="Total Revenue"
        value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
        trend={metrics.revenueGrowth}
        trendLabel="vs previous period"
        icon={IndianRupee}
      />
      <MetricCard
        variant="dark"
        label="Bill Volume"
        value={metrics.billVolume.toLocaleString()}
        unit="bills"
        icon={FileText}
      />
      <MetricCard
        variant="dark"
        label="Average Order Value"
        value={`₹${metrics.avgOrderValue.toLocaleString('en-IN')}`}
        icon={ShoppingBag}
      />
      <MetricCard
        variant="dark"
        label="Total Discounts"
        value={`₹${metrics.totalDiscounts.toLocaleString('en-IN')}`}
        icon={Tag}
      />
    </>
  );
}
