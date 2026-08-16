/**
 * SGHASH — MultiBranchPerformanceChart
 * Comparative bar chart plotting the revenue of physical branches + webstore.
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { getBranchComparison } from '../../../services/analyticsService';
import Spinner from '../../../components/ui/Spinner';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BRANCH_LABELS } from '../../../mock-data/inventory';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function MultiBranchPerformanceChart() {
  const { timePeriod } = useBranch();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      const effectivePeriod = timePeriod === 'custom' ? 'monthly' : timePeriod;
      
      const res = await getBranchComparison(effectivePeriod);
        
      if (isMounted && res.success && res.data) {
        setChartData(res.data);
      }
      if (isMounted) setLoading(false);
    };

    fetchData();
    return () => { isMounted = false; };
  }, [timePeriod]);

  if (loading) {
    return (
      <div className="metric-card metric-card--white flex-center" style={{ height: 350 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!chartData) return null;

  const data = {
    labels: chartData.map(d => BRANCH_LABELS[d.branch] || d.branch),
    datasets: [
      {
        label: 'Revenue',
        data: chartData.map(d => d.revenue),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#16a34a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Revenue: ₹${context.raw.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${(value / 100000).toFixed(1)}L`,
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#6b7280'
        },
        grid: { color: '#f3f4f6' },
        border: { display: false }
      },
      x: {
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#374151'
        },
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  return (
    <div className="metric-card metric-card--white" style={{ height: 350 }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
