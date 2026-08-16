/**
 * SGHASH — StaffDirectoryPanel
 * Directory table to select staff for Credential Manager.
 */

import { useState, useEffect } from 'react';
import { getStaffDirectory } from '../../../services/staffService';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import CredentialManagerModal from './CredentialManagerModal';
import { BRANCH_LABELS } from '../../../mock-data/inventory';

export default function StaffDirectoryPanel() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    const res = await getStaffDirectory();
    if (res.success) {
      setStaffList(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getStaffDirectory().then(res => {
      if (isMounted && res.success) {
        setStaffList(res.data);
      }
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const handleRowClick = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (val) => <span style={{ fontWeight: 500 }}>{val}</span> },
    { key: 'role', label: 'Role' },
    { key: 'branch', label: 'Branch', render: (val) => BRANCH_LABELS[val] || 'All' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span style={{ 
          color: val === 'active' ? 'var(--color-primary)' : 'var(--color-danger)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 600
        }}>
          {val.toUpperCase()}
        </span>
      )
    },
  ];

  if (loading) return <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>;

  return (
    <>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <p className="text-small text-on-canvas-muted" style={{ marginBottom: 'var(--space-md)' }}>
          Click on a staff member to manage their credentials or access state.
        </p>
        <DataTable
          columns={columns}
          data={staffList}
          keyField="id"
          onRowClick={handleRowClick}
          className="flex-1"
        />
      </div>

      <CredentialManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staff={selectedStaff}
        onActionComplete={fetchStaff}
      />
    </>
  );
}
