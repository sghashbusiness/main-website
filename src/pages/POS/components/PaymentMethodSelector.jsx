/**
 * SGHASH — PaymentMethodSelector
 */

import { Banknote, CreditCard, QrCode, Split } from 'lucide-react';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';
import InputField from '../../../components/ui/InputField';
import { calculateChangeDue } from '../../../services/posService';

export default function PaymentMethodSelector({ summary, payment, setPayment }) {
  
  const options = [
    { label: <div className="flex-center" style={{ gap: 6 }}><Banknote size={16} /> Cash</div>, value: 'cash' },
    { label: <div className="flex-center" style={{ gap: 6 }}><QrCode size={16} /> UPI</div>, value: 'upi' },
    { label: <div className="flex-center" style={{ gap: 6 }}><CreditCard size={16} /> Card</div>, value: 'card' },
    { label: <div className="flex-center" style={{ gap: 6 }}><Split size={16} /> Split</div>, value: 'split' },
  ];

  const handleMethodChange = (method) => {
    setPayment({ ...payment, method });
  };

  const updateSplit = (field, value) => {
    setPayment({ 
      ...payment, 
      splitAmounts: { ...payment.splitAmounts, [field]: value } 
    });
  };

  const changeDue = calculateChangeDue(summary.grandTotal, parseFloat(payment.cashReceived) || 0);

  return (
    <div className="pos-panel">
      <div className="pos-panel__title" style={{ fontSize: 'var(--font-size-sm)' }}>
        Payment Method
      </div>
      <SegmentedToggle options={options} value={payment.method} onChange={handleMethodChange} />

      {payment.method === 'cash' && (
        <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <InputField
            label="Cash Received (₹)"
            type="number"
            value={payment.cashReceived}
            onChange={(e) => setPayment({ ...payment, cashReceived: e.target.value })}
            placeholder="0.00"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-sm)', fontWeight: 600, color: changeDue > 0 ? 'var(--color-primary-dark)' : 'inherit' }}>
            <span>Change Due:</span>
            <span>₹{changeDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}

      {payment.method === 'split' && (
        <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', padding: 'var(--space-md)', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <InputField
            label="Cash Amount (₹)"
            type="number"
            value={payment.splitAmounts.cash === 0 ? '' : payment.splitAmounts.cash}
            onChange={(e) => updateSplit('cash', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
          <InputField
            label="UPI Amount (₹)"
            type="number"
            value={payment.splitAmounts.upi === 0 ? '' : payment.splitAmounts.upi}
            onChange={(e) => updateSplit('upi', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
          <InputField
            label="Card Amount (₹)"
            type="number"
            value={payment.splitAmounts.card === 0 ? '' : payment.splitAmounts.card}
            onChange={(e) => updateSplit('card', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
          
          {(() => {
            const splitTotal = (payment.splitAmounts.cash || 0) + (payment.splitAmounts.upi || 0) + (payment.splitAmounts.card || 0);
            const diff = summary.grandTotal - splitTotal;
            return (
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-sm)', fontWeight: 600,
                color: Math.abs(diff) < 0.01 ? 'var(--color-success)' : 'var(--color-danger)'
              }}>
                <span>Remaining:</span>
                <span>₹{diff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
