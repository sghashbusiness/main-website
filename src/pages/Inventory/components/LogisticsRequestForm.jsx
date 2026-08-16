/**
 * SGHASH — LogisticsRequestForm
 */

import { useState } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import { requestStock } from '../../../services/inventoryService';
import InputField from '../../../components/ui/InputField';
import PillButton from '../../../components/ui/PillButton';
import { BRANCHES, BRANCH_LABELS } from '../../../mock-data/inventory';
import { Send, Plus, Trash2 } from 'lucide-react';

export default function LogisticsRequestForm() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();
  const [targetBranch, setTargetBranch] = useState(BRANCHES.TRIVANDRUM);
  const [items, setItems] = useState([{ id: Date.now(), sku: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  const updateItem = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const addItem = () => setItems([...items, { id: Date.now(), sku: '', quantity: 1 }]);
  
  const removeItem = (id) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const validItems = items.filter(i => i.sku.trim() && i.quantity > 0);
    
    if (validItems.length === 0) {
      toastError("Please enter at least one valid item.");
      setLoading(false);
      return;
    }

    const res = await requestStock(selectedBranch, targetBranch, validItems);
    setLoading(false);

    if (res.success) {
      toastSuccess(res.data.message);
      setItems([{ id: Date.now(), sku: '', quantity: 1 }]);
    } else {
      toastError(res.error);
    }
  };

  const isFormValid = items.some(i => i.sku.trim() && i.quantity > 0);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div>
        <label className="text-small" style={{ fontWeight: 500, marginBottom: 'var(--space-xs)', display: 'block' }}>Request From Branch</label>
        <select
          value={targetBranch}
          onChange={(e) => setTargetBranch(e.target.value)}
          className="search-bar__input"
          style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
        >
          {Object.values(BRANCHES).filter(b => b !== selectedBranch).map(b => (
            <option key={b} value={b}>{BRANCH_LABELS[b]}</option>
          ))}
        </select>
      </div>

      <div style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-canvas-subtle)', borderBottom: '1px solid var(--color-border)' }}>
              <th className="text-xs" style={{ padding: 'var(--space-md)' }}>SKU *</th>
              <th className="text-xs" style={{ padding: 'var(--space-md)' }}>Qty *</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <InputField
                    value={row.sku}
                    onChange={(e) => updateItem(row.id, 'sku', e.target.value)}
                    placeholder="SKU"
                    disabled={loading}
                    style={{ margin: 0 }}
                  />
                </td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)', width: 100 }}>
                  <InputField
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => updateItem(row.id, 'quantity', parseInt(e.target.value) || 1)}
                    disabled={loading}
                    style={{ margin: 0 }}
                  />
                </td>
                <td style={{ padding: 'var(--space-sm)' }}>
                  <button
                    type="button"
                    onClick={() => removeItem(row.id)}
                    disabled={items.length === 1 || loading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      background: 'transparent', border: 'none',
                      color: items.length === 1 ? 'var(--color-text-tertiary)' : 'var(--color-danger)',
                      cursor: items.length === 1 ? 'not-allowed' : 'pointer'
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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PillButton type="button" variant="secondary" onClick={addItem} disabled={loading} icon={Plus}>Add Item</PillButton>
        <PillButton type="submit" variant="primary" disabled={!isFormValid || loading} loading={loading} icon={Send}>Send Request</PillButton>
      </div>
    </form>
  );
}
