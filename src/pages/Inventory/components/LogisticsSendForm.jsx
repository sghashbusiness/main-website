/**
 * SGHASH — LogisticsSendForm
 */

import { useState } from 'react';
import { useBranch } from '../../../hooks/useBranch';
import { useToast } from '../../../hooks/useToast';
import { sendStock } from '../../../services/inventoryService';
import InputField from '../../../components/ui/InputField';
import PillButton from '../../../components/ui/PillButton';
import { BRANCHES, BRANCH_LABELS } from '../../../mock-data/inventory';
import { Truck, Plus, Trash2 } from 'lucide-react';

export default function LogisticsSendForm() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();
  const [targetBranch, setTargetBranch] = useState(BRANCHES.TRIVANDRUM);
  const [imeis, setImeis] = useState([{ id: Date.now(), value: '' }]);
  const [loading, setLoading] = useState(false);

  const updateImei = (id, value) => setImeis(imeis.map(i => i.id === id ? { ...i, value } : i));
  const addImei = () => setImeis([...imeis, { id: Date.now(), value: '' }]);
  const removeImei = (id) => { if (imeis.length > 1) setImeis(imeis.filter(i => i.id !== id)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const validImeis = imeis.filter(i => i.value.length === 15).map(i => i.value);
    
    if (validImeis.length === 0) {
      toastError("Please enter at least one valid 15-digit IMEI.");
      setLoading(false);
      return;
    }

    const res = await sendStock(selectedBranch, targetBranch, validImeis);
    setLoading(false);

    if (res.success) {
      toastSuccess(res.data.message);
      setImeis([{ id: Date.now(), value: '' }]);
    } else {
      toastError(res.error);
    }
  };

  const isFormValid = imeis.some(i => i.value.length === 15);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div>
        <label className="text-small" style={{ fontWeight: 500, marginBottom: 'var(--space-xs)', display: 'block' }}>Destination Branch</label>
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
              <th className="text-xs" style={{ padding: 'var(--space-md)' }}>15-Digit IMEI *</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {imeis.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <InputField
                    value={row.value}
                    onChange={(e) => updateImei(row.id, e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder="Scan or enter 15-digit IMEI"
                    disabled={loading}
                    style={{ margin: 0 }}
                  />
                </td>
                <td style={{ padding: 'var(--space-sm)' }}>
                  <button
                    type="button"
                    onClick={() => removeImei(row.id)}
                    disabled={imeis.length === 1 || loading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      background: 'transparent', border: 'none',
                      color: imeis.length === 1 ? 'var(--color-text-tertiary)' : 'var(--color-danger)',
                      cursor: imeis.length === 1 ? 'not-allowed' : 'pointer'
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
        <PillButton type="button" variant="secondary" onClick={addImei} disabled={loading} icon={Plus}>Add IMEI</PillButton>
        <PillButton type="submit" variant="primary" disabled={!isFormValid || loading} loading={loading} icon={Truck}>Dispatch Stock</PillButton>
      </div>
    </form>
  );
}
