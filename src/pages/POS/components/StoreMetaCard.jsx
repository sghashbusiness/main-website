/**
 * SGHASH — StoreMetaCard
 */

import { BRANCH_LABELS } from '../../../mock-data/inventory';
import { Store } from 'lucide-react';

export default function StoreMetaCard({ branch }) {
  const branchName = branch === 'all' ? 'All Branches (Invalid Context)' : BRANCH_LABELS[branch];
  
  // Fictional realistic demo data
  const meta = {
    kochi: { gstin: '32AABCB1234K1Z1', address: 'MG Road, Ernakulam, Kochi 682011' },
    trivandrum: { gstin: '32AABCB1234K1Z2', address: 'Pattom, Thiruvananthapuram 695004' },
    thrissur: { gstin: '32AABCB1234K1Z3', address: 'Swaraj Round, Thrissur 680001' },
    webstore: { gstin: '32AABCB1234K1Z4', address: 'Central Warehouse, Kochi 682024' }
  };

  const branchMeta = meta[branch] || meta.kochi;

  return (
    <div className="pos-panel" style={{ background: 'var(--color-primary-subtle)', borderColor: 'var(--color-primary-transparent)', padding: 'var(--space-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{ width: 48, height: 48, background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Store size={24} />
        </div>
        <div>
          <h2 className="text-md font-semibold" style={{ color: 'var(--color-primary-dark)' }}>SGHASH Retail — {branchName}</h2>
          <div className="text-small text-on-canvas-muted" style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <span>{branchMeta.address}</span>
            <span>•</span>
            <span style={{ fontWeight: 600 }}>GSTIN: {branchMeta.gstin}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
