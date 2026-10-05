import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import Spinner from '../../../components/ui/Spinner';
import { TrendingUp, AlertOctagon, DownloadCloud } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import PillButton from '../../../components/ui/PillButton';
import DataTable from '../../../components/ui/DataTable';

export default function VelocityInsightsWidget() {
  const { selectedBranch, timePeriod } = useBranch();
  const { success: toastSuccess } = useToast();
  const [loading, setLoading] = useState(true);

  // Mock data for velocity
  const [data, setData] = useState(null);
  
  const [topMoversModalOpen, setTopMoversModalOpen] = useState(false);
  const [deadStockModalOpen, setDeadStockModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    // Simulate API fetch
    setTimeout(() => {
      if (isMounted) {
        setData({
          topMovers: [
            { sku: 'SAM-S24U-256', name: 'S24 Ultra', qty: 45 },
            { sku: 'APL-IP15-128', name: 'iPhone 15 Pro', qty: 38 },
            { sku: 'OP-12-256', name: 'OnePlus 12', qty: 29 },
            { sku: 'SAM-S23-128', name: 'Galaxy S23', qty: 24 },
            { sku: 'APL-AW9-45', name: 'Apple Watch S9', qty: 21 },
          ],
          deadStocks: [
            { name: 'Samsung Galaxy Z Fold 5', sku: 'SAM-ZFD5-512', days: 68, units: 3 },
            { name: 'Sony Xperia 1 V', sku: 'SNY-XP1V-256', days: 72, units: 2 },
            { name: 'Google Pixel 8 Pro', sku: 'GGL-P8P-128', days: 61, units: 5 },
            { name: 'Motorola Razr+', sku: 'MOT-RZR-256', days: 85, units: 1 },
            { name: 'Asus ROG Phone 7', sku: 'ASU-ROG7-512', days: 92, units: 3 },
          ],
          deadStockCount: 14 // High value units sitting 60+ days
        });
        setLoading(false);
      }
    }, 400);

    return () => { isMounted = false; };
  }, [selectedBranch, timePeriod]);

  const handleDownload = (reportName) => {
    toastSuccess(`${reportName} Excel report downloaded successfully.`);
  };

  const topMoversColumns = [
    { 
      label: 'Product & SKU', 
      key: 'product',
      render: (_, row) => (
        <div>
          <strong style={{ display: 'block', color: 'var(--color-panel-text)', fontSize: 'var(--font-size-md)' }}>{row.name}</strong>
          <span className="text-small" style={{ color: 'var(--color-muted-text)' }}>{row.sku}</span>
        </div>
      )
    },
    {
      label: 'Units Sold',
      key: 'qty',
      align: 'right',
      render: (val) => <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{val}</span>
    }
  ];

  const deadStockColumns = [
    { 
      label: 'Product & SKU', 
      key: 'product',
      render: (_, row) => (
        <div>
          <strong style={{ display: 'block', color: 'var(--color-panel-text)', fontSize: 'var(--font-size-md)' }}>{row.name}</strong>
          <span className="text-small" style={{ color: 'var(--color-muted-text)' }}>{row.sku}</span>
        </div>
      )
    },
    {
      label: 'Units Left',
      key: 'units',
      align: 'right',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-md)' }}>{val}</span>
    },
    {
      label: 'Days Stagnant',
      key: 'days',
      align: 'right',
      render: (val) => <span style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{val} days</span>
    }
  ];

  if (loading) {
    return (
      <div className="metric-card flex-center" style={{ height: '100%' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Top Sellers Card */}
      <div className="metric-card metric-card--clickable" style={{ padding: 'var(--space-md)', alignItems: 'stretch', textAlign: 'left', justifyContent: 'flex-start' }} onClick={() => setTopMoversModalOpen(true)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <TrendingUp size={20} color="var(--color-primary-light)" />
            <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Top Sellers</h3>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-pill)', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Expand
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {data.topMovers.slice(0, 5).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--color-border-light)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-panel-text)' }}>{item.name}</div>
              </div>
              <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-success)' }}>
                {item.qty} <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>sold</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dead Stock Card */}
      <div className="metric-card metric-card--clickable" style={{ flex: 1, padding: 'var(--space-md)', borderLeft: '4px solid var(--color-danger)', alignItems: 'stretch', textAlign: 'left', justifyContent: 'flex-start' }} onClick={() => setDeadStockModalOpen(true)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <AlertOctagon size={20} color="var(--color-danger)" />
            <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Dead Stock Warning</h3>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-pill)', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Expand
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {data.deadStocks.slice(0, 3).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--color-border-light)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-panel-text)' }}>{item.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', opacity: 0.8 }}></span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-panel-text)' }}>
                  {item.days}d
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Movers Modal */}
      <Modal
        isOpen={topMoversModalOpen}
        onClose={() => setTopMoversModalOpen(false)}
        title="High Velocity Products"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <p className="text-small text-on-canvas-muted" style={{ margin: 0 }}>
            Detailed view of your fastest moving inventory based on recent sales velocity.
          </p>
          
          <DataTable 
            columns={topMoversColumns} 
            data={data.topMovers} 
            keyField="sku" 
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <PillButton onClick={() => handleDownload('Top Movers')} variant="secondary" icon={DownloadCloud}>
              Download Excel
            </PillButton>
            <PillButton onClick={() => setTopMoversModalOpen(false)}>Close</PillButton>
          </div>
        </div>
      </Modal>

      {/* Dead Stock Modal */}
      <Modal
        isOpen={deadStockModalOpen}
        onClose={() => setDeadStockModalOpen(false)}
        title="Dead Stock Details"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <p className="text-small text-on-canvas-muted" style={{ margin: 0 }}>
            The following high-value units have not registered any sales movement in the last 60+ days.
          </p>
          
          <DataTable 
            columns={deadStockColumns} 
            data={data.deadStocks} 
            keyField="sku" 
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <PillButton onClick={() => handleDownload('Dead Stock')} variant="secondary" icon={DownloadCloud} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
              Download Excel
            </PillButton>
            <PillButton onClick={() => setDeadStockModalOpen(false)}>Close</PillButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
