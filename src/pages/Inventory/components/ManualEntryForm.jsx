/**
 * SGHASH — ManualEntryForm
 * Dynamic form table for single/multiple unit processing.
 */

import { useState } from 'react';
import { addStockItem } from '../../../services/inventoryService';
import { useToast } from '../../../hooks/useToast';
import InputField from '../../../components/ui/InputField';
import PillButton from '../../../components/ui/PillButton';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

export default function ManualEntryForm() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [rows, setRows] = useState([{ id: Date.now(), sku: '', imei: '' }]);
  const [loading, setLoading] = useState(false);

  const updateRow = (id, field, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), sku: '', imei: '' }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let allSuccess = true;
    let errCount = 0;

    for (const row of rows) {
      if (!row.sku || !row.imei) continue; // Skip incomplete

      const res = await addStockItem(row);
      if (!res.success) {
        toastError(`Row error (${row.sku}): ${res.error}`);
        allSuccess = false;
        errCount++;
      }
    }

    setLoading(false);
    if (allSuccess) {
      toastSuccess('All valid stock items added successfully.');
      setRows([{ id: Date.now(), sku: '', imei: '' }]); // Reset
    } else if (errCount < rows.length) {
      toastSuccess('Some items added, check errors for others.');
    }
  };

  const isFormValid = rows.some(r => r.sku && r.imei.length === 15);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th className="text-xs" style={{ padding: 'var(--space-md)' }}>SKU *</th>
              <th className="text-xs" style={{ padding: 'var(--space-md)' }}>15-Digit IMEI *</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <InputField
                    value={row.sku}
                    onChange={(e) => updateRow(row.id, 'sku', e.target.value)}
                    placeholder="e.g. APP-IP15-128"
                    disabled={loading}
                    style={{ margin: 0 }}
                  />
                </td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <InputField
                    value={row.imei}
                    onChange={(e) => updateRow(row.id, 'imei', e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder="15-digit number"
                    disabled={loading}
                    style={{ margin: 0 }}
                  />
                </td>
                <td style={{ padding: 'var(--space-sm)' }}>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1 || loading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      background: 'transparent', border: 'none',
                      color: rows.length === 1 ? 'var(--color-text-tertiary)' : 'var(--color-danger)',
                      cursor: rows.length === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
        <PillButton type="button" variant="secondary" onClick={addRow} disabled={loading} icon={Plus}>
          Add Row
        </PillButton>
        <PillButton type="submit" variant="primary" disabled={!isFormValid || loading} loading={loading} icon={CheckCircle}>
          Update Stock
        </PillButton>
      </div>
    </form>
  );
}
