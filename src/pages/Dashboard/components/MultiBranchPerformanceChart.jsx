/**
 * SGHASH — MultiBranchPerformanceChart
 * Comparative bar chart plotting the revenue of physical branches + webstore.
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useTheme } from '../../../hooks/useTheme';
import { getBranchComparison } from '../../../services/analyticsService';
import Spinner from '../../../components/ui/Spinner';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BRANCH_LABELS } from '../../../mock-data/db';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function MultiBranchPerformanceChart() {
  const { timePeriod } = useBranch();
  const { isDark } = useTheme();
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
      <div className="metric-card flex-center" style={{ height: 350 }}>
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
        borderColor: isDark ? '#ccff00' : '#aadd00',
        backgroundColor: isDark ? 'rgba(204, 255, 0, 0.15)' : 'rgba(170, 221, 0, 0.15)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: isDark ? '#161821' : '#ffffff',
        pointBorderColor: isDark ? '#ccff00' : '#aadd00',
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
          color: isDark ? '#a0a0a0' : '#6b7280'
        },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
        border: { display: false }
      },
      x: {
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: isDark ? '#a0a0a0' : '#6b7280'
        },
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  return (
    <div className="metric-card" style={{ height: 350 }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
