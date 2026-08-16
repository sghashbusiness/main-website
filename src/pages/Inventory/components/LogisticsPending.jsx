/**
 * SGHASH — LogisticsPending
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import { getBranchPendingShipments, verifyShipment } from '../../../services/inventoryService';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import PillButton from '../../../components/ui/PillButton';
import Modal from '../../../components/ui/Modal';
import { BRANCH_LABELS } from '../../../mock-data/inventory';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

export default function LogisticsPending() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await getBranchPendingShipments(selectedBranch);
    if (res.success) {
      setShipments(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getBranchPendingShipments(selectedBranch).then(res => {
      if (isMounted && res.success) {
        setShipments(res.data);
      }
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [selectedBranch]);

  const handleVerify = async () => {
    if (!selectedTransfer) return;
    setVerifyLoading(true);
    
    // Simulating verifying all items
    const res = await verifyShipment(selectedTransfer.id, []);
    setVerifyLoading(false);

    if (res.success) {
      toastSuccess(res.data.message);
      setSelectedTransfer(null);
      fetchPending();
    } else {
      toastError(res.error);
    }
  };

  const columns = [
    { key: 'id', label: 'Transfer ID', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'date', label: 'Dispatched On', render: (val) => format(new Date(val), 'dd MMM, HH:mm') },
    { key: 'sourceBranch', label: 'From', render: (val) => BRANCH_LABELS[val] },
    { 
      key: 'items', 
      label: 'Items Count',
      align: 'center',
      render: (val) => Array.isArray(val) ? val.length : 0 
    },
    { 
      key: 'action', 
      label: '',
      align: 'right',
      render: (_, row) => (
        <PillButton 
          size="sm" 
          variant="secondary"
          onClick={(e) => { e.stopPropagation(); setSelectedTransfer(row); }}
        >
          Review & Verify
        </PillButton>
      )
    }
  ];

  return (
    <>
      <div style={{ flex: 1 }}>
        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>
        ) : shipments.length > 0 ? (
          <DataTable columns={columns} data={shipments} keyField="id" />
        ) : (
          <div className="flex-center" style={{ height: 150, color: 'var(--color-text-tertiary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            No pending incoming shipments.
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedTransfer} onClose={() => setSelectedTransfer(null)} title="Verify Incoming Shipment">
        {selectedTransfer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div style={{ background: 'var(--color-canvas-subtle)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                <span className="text-sm font-semibold">{selectedTransfer.id}</span>
                <span className="text-sm">{format(new Date(selectedTransfer.date), 'dd MMM, yyyy')}</span>
              </div>
              <div className="text-sm">
                From: <strong>{BRANCH_LABELS[selectedTransfer.sourceBranch]}</strong>
              </div>
            </div>

            <div>
              <p className="text-small text-on-canvas-muted" style={{ marginBottom: 'var(--space-sm)' }}>
                The following IMEIs were dispatched. Physically verify them before accepting.
              </p>
              <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <tbody>
                    {selectedTransfer.items?.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                          {item.imei || item.sku}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
              <PillButton variant="ghost" onClick={() => setSelectedTransfer(null)} disabled={verifyLoading}>Cancel</PillButton>
              <PillButton 
                variant="primary" 
                onClick={handleVerify} 
                disabled={verifyLoading}
                loading={verifyLoading}
                icon={CheckCircle}
              >
                Accept & Verify
              </PillButton>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
