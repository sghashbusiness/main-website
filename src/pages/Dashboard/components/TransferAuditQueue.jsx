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
import { BRANCH_LABELS } from '../../../mock-data/db';
import { TRANSFER_STATUS_LABELS, TRANSFER_STATUSES } from '../../../mock-data/db';
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
      align: 'center',
      render: (val) => format(new Date(val), 'dd MMM, HH:mm')
    },
    { 
      key: 'route', 
      label: 'Route',
      align: 'center',
      render: (_, row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
          <span>{BRANCH_LABELS[row.sourceBranch]}</span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>→</span> 
          <span>{BRANCH_LABELS[row.destinationBranch]}</span>
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      align: 'center',
      render: (val) => (
          <span style={{ 
            fontSize: 'var(--font-size-xs)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-surface-hover)',
            color: 'var(--color-text-primary)',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
          {TRANSFER_STATUS_LABELS[val]}
        </span>
      )
    },
    {
      key: 'eta',
      label: 'ETA',
      align: 'center',
      render: (_, row) => {
        if (row.status === TRANSFER_STATUSES.IN_TRANSIT) return '2 Hours';
        if (row.status === TRANSFER_STATUSES.PENDING_VERIFICATION) return 'Pending...';
        if (row.status === TRANSFER_STATUSES.APPROVED) return 'Dispatching';
        return '—';
      }
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
        return <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>;
      }
    }
  ];

  if (loading) return <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>;

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-panel-text)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
          Stock Transfer
        </h3>
      </div>
      <DataTable
        columns={columns}
        data={transfers}
        keyField="id"
        className="flex-1"
      />
    </div>
  );
}
