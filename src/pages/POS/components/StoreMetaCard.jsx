/**
 * SGHASH — StoreMetaCard
 */

import { BRANCH_LABELS, BRANCH_DETAILS } from '../../../mock-data/db';
import { Store } from 'lucide-react';

export default function StoreMetaCard({ branch }) {
  const branchName = branch === 'all' ? 'All Branches (Invalid Context)' : BRANCH_LABELS[branch];
  const branchMeta = BRANCH_DETAILS[branch] || BRANCH_DETAILS.kochi;

  return (
    <div className="pos-panel" style={{ background: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', padding: 'var(--space-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{ width: 48, height: 48, background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body-bg)' }}>
          <Store size={24} />
        </div>
        <div>
          <h2 className="text-md font-semibold" style={{ color: 'var(--color-panel-text)' }}>{branchMeta.tradeName}</h2>
          <div className="text-small" style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--color-muted-text)', marginTop: 4, flexWrap: 'wrap' }}>
            <span>{branchMeta.address}</span>
            <span>•</span>
            <span style={{ fontWeight: 600 }}>GSTIN: {branchMeta.gstin}</span>
            <span>•</span>
            <span>{branchMeta.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
