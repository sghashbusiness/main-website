/**
 * SGHASH — InterStoreLogistics
 */

import { useState } from 'react';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';
import LogisticsRequestForm from './LogisticsRequestForm';
import LogisticsSendForm from './LogisticsSendForm';
import LogisticsPending from './LogisticsPending';
import { ArrowLeftRight } from 'lucide-react';

const LOGISTICS_TABS = [
  { label: 'Request Stock', value: 'request' },
  { label: 'Send Stock', value: 'send' },
  { label: 'Pending Shipments', value: 'pending' },
];

export default function InterStoreLogistics() {
  const [tab, setTab] = useState('request');

  return (
    <div className="inventory-panel" style={{ maxWidth: 800 }}>
      <div className="inventory-panel__title" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <ArrowLeftRight size={20} className="text-primary" />
          Inter-Store Logistics
        </div>
      </div>
      
      <SegmentedToggle
        options={LOGISTICS_TABS}
        value={tab}
        onChange={setTab}
      />

      <div style={{ paddingTop: 'var(--space-md)' }}>
        {tab === 'request' && <LogisticsRequestForm />}
        {tab === 'send' && <LogisticsSendForm />}
        {tab === 'pending' && <LogisticsPending />}
      </div>
    </div>
  );
}
