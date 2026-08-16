/**
 * SGHASH — InventoryPage
 * 
 * Stock Operations Module.
 * Restricted to Inventory Manager and Owner.
 */

import { useState } from 'react';
import { useBranch } from '../../hooks/useBranch';
import SegmentedToggle from '../../components/ui/SegmentedToggle';
import GlobalSearch from './components/GlobalSearch';
import StockIngestion from './components/StockIngestion';
import InterStoreLogistics from './components/InterStoreLogistics';
import { BRANCH_LABELS } from '../../mock-data/inventory';
import './InventoryPage.css';

const TABS = [
  { label: 'Global Search', value: 'search' },
  { label: 'Stock Ingestion', value: 'ingestion' },
  { label: 'Inter-Store Logistics', value: 'logistics' },
];

export default function InventoryPage() {
  const { selectedBranch } = useBranch();
  const [activeTab, setActiveTab] = useState('search');

  const branchName = selectedBranch === 'all' ? 'All Branches' : BRANCH_LABELS[selectedBranch];

  return (
    <div className="inventory-page anim-fade-in">
      <div className="inventory-page__header">
        <div>
          <h1 className="text-page-title">Stock Operations</h1>
          <p className="text-on-canvas-muted" style={{ marginTop: 'var(--space-xs)' }}>
            Active Context: <strong style={{ color: 'var(--color-primary)' }}>{branchName}</strong>
          </p>
        </div>
        
        <SegmentedToggle
          options={TABS}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="inventory-page__content">
        {activeTab === 'search' && <GlobalSearch />}
        {activeTab === 'ingestion' && <StockIngestion />}
        {activeTab === 'logistics' && <InterStoreLogistics />}
      </div>
    </div>
  );
}
