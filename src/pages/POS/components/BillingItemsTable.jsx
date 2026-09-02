/**
 * SGHASH — BillingItemsTable
 */

import { Trash2 } from 'lucide-react';
import InputField from '../../../components/ui/InputField';

export default function BillingItemsTable({ items, onRemove, onUpdateDiscount }) {
  if (items.length === 0) {
    return (
      <div className="flex-center" style={{ height: 300, border: '2px dashed var(--color-input-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-muted-text)' }}>
        Cart is empty. Scan an IMEI to begin billing.
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-input-bg)', border: '1px solid var(--color-input-border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
        <thead>
          <tr style={{ background: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-divider)' }}>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 40 }}>#</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)' }}>Description & IMEI</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 60, textAlign: 'center' }}>Qty</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 80 }}>HSN</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 100, textAlign: 'right' }}>Unit Rate</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 100 }}>Disc (%)</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 120, textAlign: 'right' }}>CGST / SGST</th>
            <th className="text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', width: 120, textAlign: 'right' }}>Net Total</th>
            <th style={{ width: 50 }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                {index + 1}
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div className="text-xs text-on-canvas-muted">
                  {item.sku} 
                  {item.imeis && item.imeis.length > 0 && (
                    <span> • IMEIs: {item.imeis.join(', ')}</span>
                  )}
                </div>
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center', fontWeight: 600 }}>
                {item.quantity}
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                {item.hsnCode}
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                ₹{item.unitRate.toLocaleString('en-IN')}
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <InputField
                    type="number"
                    value={item.discount === 0 ? '' : item.discount}
                    onChange={(e) => {
                      let val = parseFloat(e.target.value) || 0;
                      if (val > 100) val = 100;
                      if (val < 0) val = 0;
                      onUpdateDiscount(item.id, val);
                    }}
                    placeholder="0"
                    style={{ margin: 0, textAlign: 'right', width: '60px' }}
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-on-canvas-muted">%</span>
                </div>
                {item.discountAmount > 0 && (
                  <div className="text-xs text-on-canvas-muted" style={{ textAlign: 'right', marginTop: '2px' }}>
                    -₹{item.discountAmount.toLocaleString('en-IN')}
                  </div>
                )}
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', fontSize: 'var(--font-size-xs)' }}>
                <div>₹{item.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({item.cgstRate}%)</div>
                <div>₹{item.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({item.sgstRate}%)</div>
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', fontWeight: 600 }}>
                ₹{item.netTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--color-danger)',
                    cursor: 'pointer', padding: 4, borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
