/**
 * SGHASH — TransferAuditQueue
 * Transfer stream with 'Force Approve' action.
 */

import { useState, useEffect } from 'react';
import { getTransfers, forceApproveTransfer } from '../../../services/inventoryService';
import { useToast } from '../../../hooks/useToast';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import PillButton from '../../../components/ui/PillButton';
import { BRANCH_LABELS } from '../../../mock-data/inventory';
import { TRANSFER_STATUS_LABELS, TRANSFER_STATUSES } from '../../../mock-data/transfers';
import { format } from 'date-fns';

export default function TransferAuditQueue() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    const res = await getTransfers();
    if (res.success) {
      setTransfers(res.data);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getTransfers().then(res => {
      if (isMounted && res.success) {
        setTransfers(res.data);
      }
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const handleForceApprove = async (transferId) => {
    const res = await forceApproveTransfer(transferId);
    if (res.success) {
      toastSuccess(res.data.message);
      fetchTransfers();
    } else {
      toastError(res.error);
    }
  };

  const columns = [
    { 
      key: 'date', 
      label: 'Date',
      render: (val) => format(new Date(val), 'dd MMM, HH:mm')
    },
    { 
      key: 'route', 
      label: 'Route',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--font-size-xs)' }}>
          <div>{BRANCH_LABELS[row.sourceBranch]}</div>
          <div style={{ color: 'var(--color-text-tertiary)' }}>→ {BRANCH_LABELS[row.destinationBranch]}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span style={{ 
          fontSize: '11px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#a3b8aa',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>
          {TRANSFER_STATUS_LABELS[val]}
        </span>
      )
    },
    { 
      key: 'action', 
      label: 'Action',
      align: 'right',
      render: (_, row) => {
        if (row.status === TRANSFER_STATUSES.REQUESTED || row.status === TRANSFER_STATUSES.REJECTED) {
          return (
            <PillButton 
              size="sm" 
              variant="primary"
              onClick={(e) => { e.stopPropagation(); handleForceApprove(row.id); }}
            >
              Force Approve
            </PillButton>
          );
        }
        return <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>—</span>;
      }
    }
  ];

  if (loading) return <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>;

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DataTable
        columns={columns}
        data={transfers}
        keyField="id"
        className="flex-1"
      />
    </div>
  );
}
