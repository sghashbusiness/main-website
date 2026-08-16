/**
 * SGHASH — InvoiceDeliveryToggle
 */

import { FileText, Smartphone } from 'lucide-react';
import SegmentedToggle from '../../../components/ui/SegmentedToggle';

export default function InvoiceDeliveryToggle({ value, onChange }) {
  const options = [
    { label: <div className="flex-center" style={{ gap: 6 }}><Smartphone size={16} /> WhatsApp</div>, value: 'whatsapp' },
    { label: <div className="flex-center" style={{ gap: 6 }}><FileText size={16} /> Thermal</div>, value: 'thermal' },
  ];

  return (
    <div className="pos-panel">
      <div className="pos-panel__title" style={{ fontSize: 'var(--font-size-sm)' }}>
        Invoice Delivery
      </div>
      <SegmentedToggle options={options} value={value} onChange={onChange} />
    </div>
  );
}
