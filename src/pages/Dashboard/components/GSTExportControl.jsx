/**
 * SGHASH — GSTExportControl
 * Simulates GSTR1 JSON/Excel export.
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import { exportGSTR1 } from '../../../services/analyticsService';
import PillButton from '../../../components/ui/PillButton';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import { DownloadCloud, CheckCircle } from 'lucide-react';
import { BRANCH_LABELS } from '../../../mock-data/db';

export default function GSTExportControl() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();
  
  const [period, setPeriod] = useState('monthly');
  const [exportBranch, setExportBranch] = useState(selectedBranch);
  const [loading, setLoading] = useState(false);

  // Keep local branch in sync if global branch changes
  useEffect(() => {
    setExportBranch(selectedBranch);
  }, [selectedBranch]);

  const handleExport = async () => {
    setLoading(true);
    const res = await exportGSTR1(exportBranch, period);
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

  const branchOptions = [
    { label: 'All Branches', value: 'all' },
    ...Object.entries(BRANCH_LABELS).map(([value, label]) => ({ label, value }))
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-panel-text)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
          GSTR1 Export
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div>
            <label className="text-small" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>Target Branch</label>
            <CustomDropdown 
              value={exportBranch}
              onChange={setExportBranch}
              options={branchOptions}
              placeholder="Select Branch"
            />
          </div>
          <div>
            <label className="text-small" style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>Tax Period</label>
            <SegmentedToggle
              options={periodOptions}
              value={period}
              onChange={setPeriod}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <PillButton 
          fullWidth 
          icon={DownloadCloud} 
          loading={loading}
          onClick={handleExport}
        >
          Download GSTR1 (JSON)
        </PillButton>
        <PillButton 
          fullWidth 
          variant="secondary"
          icon={DownloadCloud} 
          loading={loading}
          onClick={handleExport}
        >
          Download CSV/Excel Summary
        </PillButton>
      </div>
    </div>
  );
}
