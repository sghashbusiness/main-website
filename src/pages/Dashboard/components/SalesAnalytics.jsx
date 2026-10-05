import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranch } from '../../../hooks/useBranch';
import { getMetrics, getConsolidated } from '../../../services/analyticsService';
import MetricCard from '../../../components/ui/MetricCard';
import { IndianRupee, FileText, ShoppingBag, Tag, AlertTriangle, Package, Truck, ArrowRight } from 'lucide-react';
import Spinner from '../../../components/ui/Spinner';
import Modal from '../../../components/ui/Modal';
import PillButton from '../../../components/ui/PillButton';

export default function SalesAnalytics() {
  const { selectedBranch, timePeriod, customDateRange } = useBranch();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issuesModalOpen, setIssuesModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleGoToTransfers = () => {
    setIssuesModalOpen(false);
    setTimeout(() => {
      const el = document.getElementById('logistics-stock-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleGoToInventory = () => {
    setIssuesModalOpen(false);
    navigate('/inventory');
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      const effectivePeriod = timePeriod === 'custom' ? 'monthly' : timePeriod;
      
      let res;
      if (selectedBranch === 'all') {
        res = await getConsolidated(effectivePeriod);
      } else {
        res = await getMetrics(selectedBranch, effectivePeriod);
      }
      
      if (isMounted) {
        if (res.success && res.data) {
          if (timePeriod === 'custom' && customDateRange.startDate && customDateRange.endDate) {
            // Simulate data change based on custom range days
            const days = Math.max(1, Math.round((new Date(customDateRange.endDate) - new Date(customDateRange.startDate)) / (1000 * 60 * 60 * 24)));
            const scale = Math.max(0.1, days / 30);
            
            const scaledData = {
              ...res.data,
              revenue: Math.round(res.data.revenue * scale),
              billVolume: Math.round(res.data.billVolume * scale),
              itemsSold: Math.round(res.data.itemsSold * scale),
              discounts: Math.round(res.data.discounts * scale)
            };
            setMetrics(scaledData);
          } else {
            setMetrics(res.data);
          }
        } else {
          setError(res.error || 'No data available');
        }
        setLoading(false);
      }
    };

    fetchMetrics();
    return () => { isMounted = false; };
  }, [selectedBranch, timePeriod, customDateRange]);

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
      <div 
        onClick={() => setIssuesModalOpen(true)}
        style={{ 
          gridColumn: 'span 2', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 32px',
          minHeight: '80px',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(225, 29, 72, 0.05)',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(225, 29, 72, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(225, 29, 72, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.3)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={24} color="#fb7185" />
          <span style={{ color: '#fb7185', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>12 Actionable Issues Require Attention</span>
        </div>
        <span style={{ fontSize: 'var(--font-size-md)', color: '#fb7185', fontWeight: 600 }}>Review Now &rarr;</span>
      </div>
      <MetricCard
        variant="dark"
        label="Total Revenue"
        value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
        trend={metrics.revenueGrowth}
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

      <Modal
        isOpen={issuesModalOpen}
        onClose={() => setIssuesModalOpen(false)}
        title="Actionable Alerts Details"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <p className="text-small text-on-canvas-muted" style={{ margin: 0 }}>
            The following issues have been flagged across your branches and require immediate attention.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-danger-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(224, 84, 115, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <Truck style={{ color: 'var(--color-danger)' }} size={20} />
                <span style={{ fontWeight: 600, color: 'var(--color-danger)', fontSize: 'var(--font-size-md)' }}>7 Pending Logistics Transfers (&gt;48h)</span>
              </div>
              <PillButton variant="secondary" onClick={handleGoToTransfers} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', padding: '6px 16px', fontSize: '12px' }}>
                Review
              </PillButton>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-sm) var(--space-md)', background: 'rgba(255, 170, 0, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 170, 0, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <Package style={{ color: '#ffaa00' }} size={20} />
                <span style={{ fontWeight: 600, color: '#ffaa00', fontSize: 'var(--font-size-md)' }}>5 Low Stock Warnings (Webstore)</span>
              </div>
              <PillButton variant="secondary" onClick={handleGoToInventory} style={{ borderColor: '#ffaa00', color: '#ffaa00', padding: '6px 16px', fontSize: '12px' }}>
                Manage
              </PillButton>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
            <PillButton onClick={() => setIssuesModalOpen(false)}>Acknowledge & Close</PillButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
