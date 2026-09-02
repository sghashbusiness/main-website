/**
 * SGHASH UI — BranchFilterDropdown
 * Architecture Spec §3.1: "<BranchFilterDropdown>: The master override switch.
 * Adjusting this re-renders all subsequent child components."
 */

import { useBranch } from '../../hooks/useBranch';
import { Store } from 'lucide-react';
import { BRANCHES, BRANCH_LABELS } from '../../mock-data/inventory';
import './BranchFilterDropdown.css';

import CustomDropdown from './CustomDropdown';

export default function BranchFilterDropdown({ className = '' }) {
  const { selectedBranch, setBranch } = useBranch();

  const options = [
    { value: 'all', label: 'All Branches (Consolidated)' },
    ...Object.values(BRANCHES).map(branchId => ({
      value: branchId,
      label: BRANCH_LABELS[branchId]
    }))
  ];

  return (
    <div className={`branch-filter ${className}`}>
      <div className="branch-filter__icon-wrap">
        <Store size={16} className="branch-filter__icon" />
      </div>
      <CustomDropdown 
        options={options}
        value={selectedBranch}
        onChange={setBranch}
        className="branch-filter__custom-dropdown"
      />
    </div>
  );
}
