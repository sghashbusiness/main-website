/**
 * SGHASH UI — BranchFilterDropdown
 * Architecture Spec §3.1: "<BranchFilterDropdown>: The master override switch.
 * Adjusting this re-renders all subsequent child components."
 */

import { useBranch } from '../../hooks/useBranch';
import { Store } from 'lucide-react';
import { BRANCHES, BRANCH_LABELS } from '../../mock-data/inventory';
import './BranchFilterDropdown.css';

export default function BranchFilterDropdown({ className = '' }) {
  const { selectedBranch, setBranch } = useBranch();

  return (
    <div className={`branch-filter ${className}`}>
      <div className="branch-filter__icon-wrap">
        <Store size={16} className="branch-filter__icon" />
      </div>
      <select
        value={selectedBranch}
        onChange={(e) => setBranch(e.target.value)}
        className="branch-filter__select"
        aria-label="Filter by branch"
      >
        <option value="all">All Branches (Consolidated)</option>
        {Object.values(BRANCHES).map((branchId) => (
          <option key={branchId} value={branchId}>
            {BRANCH_LABELS[branchId]}
          </option>
        ))}
      </select>
    </div>
  );
}
