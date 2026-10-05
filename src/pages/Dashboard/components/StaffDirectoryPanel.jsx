/**
 * SGHASH — StaffDirectoryPanel
 * Directory table to select staff for Credential Manager.
 */

import { useState, useEffect, useMemo } from 'react';
import { getStaffDirectory } from '../../../services/staffService';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import CredentialManagerModal from './CredentialManagerModal';
import { BRANCH_LABELS } from '../../../mock-data/db';

export default function StaffDirectoryPanel() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterRole, setFilterRole] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

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

  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      const matchRole = filterRole === 'all' || staff.role === filterRole;
      const matchBranch = filterBranch === 'all' || staff.branch === filterBranch;
      return matchRole && matchBranch;
    });
  }, [staffList, filterRole, filterBranch]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(staffList.map(s => s.role));
    return Array.from(roles).map(r => ({ label: String(r).replace('_', ' ').toUpperCase(), value: r }));
  }, [staffList]);

  const roleOptions = [{ label: 'All Roles', value: 'all' }, ...uniqueRoles];
  const branchOptions = [
    { label: 'All Branches', value: 'all' },
    ...Object.entries(BRANCH_LABELS).map(([value, label]) => ({ label, value }))
  ];

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
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <div className="staff-row-actions">
          <button 
            style={{ padding: '4px 8px', fontSize: '10px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-panel-text)', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); /* simulate suspend */ }}
          >
            Suspend
          </button>
          <button 
            style={{ padding: '4px 8px', fontSize: '10px', background: 'var(--color-primary-dark)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); /* simulate reset PIN */ }}
          >
            Reset PIN
          </button>
        </div>
      )
    }
  ];

  if (loading) return <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>;

  return (
    <>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <h3 style={{ margin: 0, color: 'var(--color-panel-text)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
            User Accounts Status
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <CustomDropdown 
              value={filterBranch}
              onChange={setFilterBranch}
              options={branchOptions}
              placeholder="Branch"
            />
            <CustomDropdown 
              value={filterRole}
              onChange={setFilterRole}
              options={roleOptions}
              placeholder="Role"
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredStaff}
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
