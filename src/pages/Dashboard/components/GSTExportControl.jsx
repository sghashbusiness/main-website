/**
 * SGHASH — GSTExportControl
 * Simulates GSTR1 JSON/Excel export.
 */

import { useState } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import { exportGSTR1 } from '../../../services/analyticsService';
import PillButton from '../../../components/ui/PillButton';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';
import { DownloadCloud, CheckCircle } from 'lucide-react';
import { BRANCH_LABELS } from '../../../mock-data/inventory';

export default function GSTExportControl() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();
  
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const res = await exportGSTR1(selectedBranch, period);
    setLoading(false);
    
    if (res.success) {
      toastSuccess(res.data.message);
    } else {
      toastError(res.error);
    }
  };

  const periodOptions = [
    { label: 'This Month', value: 'monthly' },
    { label: 'Last Quarter', value: 'quarterly' },
    { label: 'Financial YTD', value: 'yearly' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p className="text-small text-on-canvas-muted">
          Generate consolidated GSTR1 exports. The export will respect the currently selected branch scope: 
          <strong> {selectedBranch === 'all' ? 'All Branches' : BRANCH_LABELS[selectedBranch]}</strong>.
        </p>
        
        <div>
          <label className="text-small" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>Tax Period</label>
          <SegmentedToggle
            options={periodOptions}
            value={period}
            onChange={setPeriod}
          />
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <PillButton 
          fullWidth 
          icon={DownloadCloud} 
          loading={loading}
          onClick={handleExport}
        >
          Download GSTR1 (JSON)
        </PillButton>
      </div>
    </div>
  );
}
