/**
 * SGHASH — TenderSplitWidget
 * Displays payment methods split using Chart.js Pie.
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useTheme } from '../../../hooks/useTheme';
import { getMetrics, getConsolidated, getTenderBreakdown } from '../../../services/analyticsService';
import Spinner from '../../../components/ui/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Modal from '../../../components/ui/Modal';
import DataTable from '../../../components/ui/DataTable';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';
import PillButton from '../../../components/ui/PillButton';
import { DownloadCloud, ArrowUpRight, ArrowDownRight } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

// (Removed static MOCK_BRANCH_BREAKDOWN)

export default function TenderSplitWidget() {
  const { selectedBranch, timePeriod, customDateRange } = useBranch();
  const { isDark } = useTheme();
  const [tenderData, setTenderData] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [comparePeriod, setComparePeriod] = useState('last_month');

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      const effectivePeriod = timePeriod === 'custom' ? 'monthly' : timePeriod;
      
      const res = selectedBranch === 'all' 
        ? await getConsolidated(effectivePeriod) 
        : await getMetrics(selectedBranch, effectivePeriod);
        
      const breakdownRes = await getTenderBreakdown(effectivePeriod);
        
      if (isMounted && res.success && res.data) {
        if (timePeriod === 'custom' && customDateRange.startDate && customDateRange.endDate) {
          const days = Math.max(1, Math.round((new Date(customDateRange.endDate) - new Date(customDateRange.startDate)) / (1000 * 60 * 60 * 24)));
          const scale = Math.max(0.1, days / 30);
          
          setTenderData({
            cash: Math.round(res.data.tenderSplit.cash * scale),
            upi: Math.round(res.data.tenderSplit.upi * scale),
            card: Math.round(res.data.tenderSplit.card * scale)
          });

          if (breakdownRes.success && breakdownRes.data) {
            setBreakdownData(breakdownRes.data.map(b => ({
              ...b,
              cash: Math.round(b.cash * scale),
              upi: Math.round(b.upi * scale),
              card: Math.round(b.card * scale),
              prevTotal: Math.round(b.prevTotal * scale)
            })));
          }
        } else {
          setTenderData(res.data.tenderSplit);
          if (breakdownRes.success && breakdownRes.data) {
            setBreakdownData(breakdownRes.data);
          }
        }
      }
      if (isMounted) setLoading(false);
    };

    fetchData();
    return () => { isMounted = false; };
  }, [selectedBranch, timePeriod, customDateRange]);

  if (loading) {
    return (
      <div className="metric-card flex-center" style={{ height: '100%' }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!tenderData) return null;

  const total = tenderData.cash + tenderData.upi + tenderData.card;
  const formatValue = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const getPercent = (val, base = total) => Math.round((val / base) * 100);

  const data = {
    labels: [
      `Cash (${getPercent(tenderData.cash)}%)`, 
      `UPI (${getPercent(tenderData.upi)}%)`, 
      `Card/EMI (${getPercent(tenderData.card)}%)`
    ],
    datasets: [
      {
        data: [tenderData.cash, tenderData.upi, tenderData.card],
        backgroundColor: ['#2ac079', '#2490d1', '#7843d1'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#a0a0a0' : '#666666',
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ₹${context.raw.toLocaleString('en-IN')}`
        }
      }
    }
  };

  // Columns for the expanded view DataTable
  const expandedColumns = [
    { label: 'Branch', key: 'branch', render: (val) => <strong style={{ color: 'var(--color-text-primary)', fontSize: '13px', whiteSpace: 'nowrap' }}>{val}</strong> },
    { 
      label: 'Cash', 
      key: 'cash', 
      align: 'right',
      render: (val, row) => (
        <div>
          <div style={{ color: '#2ac079', fontWeight: 600, fontSize: '13px' }}>{formatValue(val)}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted-text)' }}>{getPercent(val, row.cash + row.upi + row.card)}%</div>
        </div>
      )
    },
    { 
      label: 'UPI', 
      key: 'upi', 
      align: 'right',
      render: (val, row) => (
        <div>
          <div style={{ color: '#2490d1', fontWeight: 600, fontSize: '13px' }}>{formatValue(val)}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted-text)' }}>{getPercent(val, row.cash + row.upi + row.card)}%</div>
        </div>
      )
    },
    { 
      label: 'Card/EMI', 
      key: 'card', 
      align: 'right',
      render: (val, row) => (
        <div>
          <div style={{ color: '#7843d1', fontWeight: 600, fontSize: '13px' }}>{formatValue(val)}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted-text)' }}>{getPercent(val, row.cash + row.upi + row.card)}%</div>
        </div>
      )
    },
    { 
      label: 'Total Collected', 
      key: 'total', 
      align: 'right',
      render: (_, row) => {
        const rowTotal = row.cash + row.upi + row.card;
        return <strong style={{ color: 'var(--color-panel-text)', fontSize: '13px' }}>{formatValue(rowTotal)}</strong>;
      }
    },
    {
      label: 'Growth',
      key: 'growth',
      align: 'right',
      render: (_, row) => {
        const rowTotal = row.cash + row.upi + row.card;
        const growth = ((rowTotal - row.prevTotal) / row.prevTotal) * 100;
        const isPos = growth >= 0;
        const Icon = isPos ? ArrowUpRight : ArrowDownRight;
        const color = isPos ? 'var(--color-success)' : 'var(--color-danger)';
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color, fontWeight: 600, fontSize: '13px' }}>
            <Icon size={14} />
            {Math.abs(growth).toFixed(1)}%
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="metric-card metric-card--clickable" style={{ height: '100%', minHeight: 320, justifyContent: 'flex-start', alignItems: 'stretch' }} onClick={() => setModalOpen(true)}>
        <div className="metric-card__header" style={{ marginBottom: 'var(--space-md)', justifyContent: 'space-between', display: 'flex' }}>
          <span className="metric-card__label" style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-md)' }}>Revenue by Payment Method</span>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-pill)', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Expand
          </span>
        </div>
        
        <div style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '200px' }}>
            <div style={{ position: 'absolute', inset: 0, paddingBottom: '20px' }}>
              <Pie data={data} options={options} />
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-panel-text)', letterSpacing: '-0.02em' }}>{formatValue(total)}</div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Revenue by Payment Method & Branch Performance"
        size="xl"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          
          {/* Top Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <p className="text-small text-on-canvas-muted" style={{ margin: 0, maxWidth: '80%' }}>
              Detailed breakdown of payment methods collected across all branches, sorted by total revenue.
            </p>
          </div>

          {/* Data Table */}
          <DataTable 
            columns={expandedColumns} 
            data={breakdownData} 
            keyField="branch" 
          />

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-md)' }}>
            <PillButton variant="secondary" icon={DownloadCloud}>
              Export Breakdown
            </PillButton>
            <PillButton onClick={() => setModalOpen(false)}>Close</PillButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
