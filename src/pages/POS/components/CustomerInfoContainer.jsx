/**
 * SGHASH — CustomerInfoContainer
 */

import InputField from '../../../components/ui/InputField';
import { User } from 'lucide-react';

export default function CustomerInfoContainer({ customer, setCustomer }) {
  const updateField = (field, value) => setCustomer({ ...customer, [field]: value });

  return (
    <div className="pos-panel">
      <div className="pos-panel__title">
        <User size={18} className="text-primary" />
        Customer Details
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <InputField 
          label="Mobile Number *"
          placeholder="10-digit mobile number"
          value={customer.mobile}
          onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
        />
        <InputField 
          label="Customer Name"
          placeholder="Optional"
          value={customer.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
        <InputField 
          label="GSTIN (B2B Only)"
          placeholder="Optional 15-character GSTIN"
          value={customer.gstin}
          onChange={(e) => updateField('gstin', e.target.value.toUpperCase().slice(0, 15))}
        />
      </div>
    </div>
  );
}
