/**
 * SGHASH — TenderSplitWidget
 * Displays payment methods split using Chart.js Doughnut.
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { getMetrics, getConsolidated } from '../../../services/analyticsService';
import Spinner from '../../../components/ui/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TenderSplitWidget() {
  const { selectedBranch, timePeriod } = useBranch();
  const [tenderData, setTenderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      const effectivePeriod = timePeriod === 'custom' ? 'monthly' : timePeriod;
      
      const res = selectedBranch === 'all' 
        ? await getConsolidated(effectivePeriod) 
        : await getMetrics(selectedBranch, effectivePeriod);
        
      if (isMounted && res.success && res.data) {
        setTenderData(res.data.tenderSplit);
      }
      if (isMounted) setLoading(false);
    };

    fetchData();
    return () => { isMounted = false; };
  }, [selectedBranch, timePeriod]);

  if (loading) {
    return (
      <div className="metric-card metric-card--dark flex-center" style={{ height: '100%' }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!tenderData) return null;

  const data = {
    labels: ['Cash', 'UPI', 'Card/EMI'],
    datasets: [
      {
        data: [tenderData.cash, tenderData.upi, tenderData.card],
        backgroundColor: [
          '#16a34a', // var(--color-primary)
          '#0ea5e9', // var(--color-info)
          '#f59e0b', // var(--color-warning)
        ],
        borderWidth: 0,
        hoverOffset: 4,
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
          color: '#a3b8aa',
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

  return (
    <div className="metric-card metric-card--dark" style={{ height: '100%', minHeight: 300 }}>
      <div className="metric-card__header" style={{ marginBottom: 'var(--space-md)' }}>
        <span className="metric-card__label">Tender Split</span>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
