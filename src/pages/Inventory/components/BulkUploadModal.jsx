/**
 * SGHASH — BulkUploadModal
 * WarningModal and FileDropzone for CSV bulk uploads.
 */

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import FileDropzone from '../../../components/ui/FileDropzone';
import PillButton from '../../../components/ui/PillButton';
import { useToast } from '../../../hooks/useToast';
import { bulkUploadStock } from '../../../services/inventoryService';
import { AlertTriangle, UploadCloud } from 'lucide-react';

export default function BulkUploadModal({ isOpen, onClose }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    
    // Simulate parsing the CSV into items
    const simulatedItems = [
      { sku: 'APP-IP15-128', name: 'iPhone 15', imei: '123456789012345' }, // Valid
      { sku: 'SAM-S24-256', name: 'Galaxy S24', imei: '987654321098765' }, // Valid
      { sku: 'TEST-123', name: 'Test', imei: '868846059281313' }, // Duplicate from mock-data
      { sku: 'ERR', name: 'Err', imei: '123' }, // Invalid format
    ];

    const res = await bulkUploadStock(simulatedItems);
    setLoading(false);
    
    if (res.success) {
      toastSuccess(`Successfully imported ${res.data.imported} items.`);
      onClose();
    } else {
      toastError(res.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Stock Ingestion">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        
        <div style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-warning)', background: 'var(--color-warning-subtle)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="text-sm">
            <strong>Mandatory Columns Required:</strong>
            <ul style={{ margin: 'var(--space-xs) 0 0', paddingLeft: 'var(--space-md)' }}>
              <li>SKU</li>
              <li>Color</li>
              <li>15-digit IMEI</li>
              <li>Cost Price (INR)</li>
              <li>Selling Price (INR)</li>
            </ul>
          </div>
        </div>

        <FileDropzone 
          onFileSelect={setFile} 
          accept=".csv,.xlsx" 
          maxSizeMB={10} 
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
          <PillButton variant="ghost" onClick={onClose} disabled={loading}>Cancel</PillButton>
          <PillButton 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!file || loading}
            loading={loading}
            icon={UploadCloud}
          >
            Process Upload
          </PillButton>
        </div>
      </div>
    </Modal>
  );
}
