import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import { exportGSTR1 } from '../../../services/analyticsService';
import PillButton from '../../../components/ui/PillButton';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/InputField';
import { DownloadCloud, Mail, MessageCircle, FileText } from 'lucide-react';
import { BRANCH_LABELS } from '../../../mock-data/db';

export default function GSTExportControl() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();
  
  const [period, setPeriod] = useState('monthly');
  const [exportBranch, setExportBranch] = useState(selectedBranch);
  const [loading, setLoading] = useState(false);
  
  // Preview / Share Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [shareType, setShareType] = useState('download'); // 'download' | 'whatsapp' | 'mail'
  const [exportData, setExportData] = useState(null);
  const [contactInfo, setContactInfo] = useState('');

  // Keep local branch in sync if global branch changes
  useEffect(() => {
    setExportBranch(selectedBranch);
  }, [selectedBranch]);

  const handlePreviewAndCheck = async (type = 'download') => {
    setLoading(true);
    const res = await exportGSTR1(exportBranch, period);
    setLoading(false);
    
    if (res.success && res.data) {
      // Data exists, open preview modal
      setExportData(res.data);
      setShareType(type);
      setContactInfo(''); // reset input
      setModalOpen(true);
    } else {
      // No data or error
      toastError(res.error || 'No data found for the selected period.');
    }
  };

  const handleConfirmShare = () => {
    if (shareType === 'whatsapp' && !contactInfo.trim()) {
      toastError('Please enter a WhatsApp number.');
      return;
    }
    if (shareType === 'mail' && !contactInfo.trim()) {
      toastError('Please enter an Email ID.');
      return;
    }
    
    if (shareType === 'whatsapp') {
      toastSuccess(`GST Report shared via WhatsApp to ${contactInfo} successfully.`);
    } else if (shareType === 'mail') {
      toastSuccess(`GST Report sent via Mail to ${contactInfo} successfully.`);
    } else {
      toastSuccess(`Downloaded ${exportData?.filename}`);
    }
    
    setModalOpen(false);
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
    <>
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
            onClick={() => handlePreviewAndCheck('download')}
          >
            Download GSTR1 (JSON)
          </PillButton>
          <PillButton 
            fullWidth 
            variant="secondary"
            icon={DownloadCloud} 
            loading={loading}
            onClick={() => handlePreviewAndCheck('download')}
          >
            Download CSV/Excel Summary
          </PillButton>
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <PillButton 
              fullWidth 
              variant="secondary"
              icon={MessageCircle} 
              loading={loading}
              onClick={() => handlePreviewAndCheck('whatsapp')}
              style={{ color: '#25D366', borderColor: '#25D366' }}
            >
              WhatsApp
            </PillButton>
            <PillButton 
              fullWidth 
              variant="secondary"
              icon={Mail} 
              loading={loading}
              onClick={() => handlePreviewAndCheck('mail')}
            >
              Email
            </PillButton>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          shareType === 'whatsapp' ? 'Share via WhatsApp' : 
          shareType === 'mail' ? 'Share via Email' : 
          'Confirm Download'
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--color-surface-hover)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={32} color="var(--color-primary-light)" />
            <div>
              <div style={{ fontWeight: 'bold' }}>{exportData?.filename}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ready for export ({exportData?.rows || 0} rows found)</div>
            </div>
          </div>

          {shareType === 'whatsapp' && (
            <InputField 
              label="WhatsApp Number" 
              placeholder="e.g. +91 9876543210" 
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              autoFocus
            />
          )}

          {shareType === 'mail' && (
            <InputField 
              label="Email ID" 
              type="email"
              placeholder="e.g. accounts@company.com" 
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              autoFocus
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '12px' }}>
            <PillButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</PillButton>
            <PillButton onClick={handleConfirmShare}>
              {shareType === 'download' ? 'Download Now' : 'Send'}
            </PillButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
