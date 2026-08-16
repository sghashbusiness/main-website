/**
 * SGHASH — StockIngestion
 * Houses Bulk Upload and Manual Entry.
 */

import { useState } from 'react';
import PillButton from '../../../components/ui/PillButton';
import { Upload, Edit3 } from 'lucide-react';
import BulkUploadModal from './BulkUploadModal';
import ManualEntryForm from './ManualEntryForm';

export default function StockIngestion() {
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  return (
    <div className="inventory-panel" style={{ maxWidth: 800 }}>
      <div className="inventory-panel__title">
        <Edit3 size={20} className="text-primary" />
        Stock Ingestion
      </div>
      
      <p className="text-small text-on-canvas-muted">
        Process incoming vendor shipments. Use Bulk Upload for large deliveries (CSV/Excel) or Manual Entry for individual units.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <PillButton variant="secondary" icon={Upload} onClick={() => setIsBulkOpen(true)}>
          Bulk Upload (CSV/Excel)
        </PillButton>
      </div>

      <div style={{ paddingTop: 'var(--space-sm)' }}>
        <h3 className="text-md font-semibold" style={{ marginBottom: 'var(--space-md)' }}>Manual Entry Grid</h3>
        <ManualEntryForm />
      </div>

      <BulkUploadModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
    </div>
  );
}
