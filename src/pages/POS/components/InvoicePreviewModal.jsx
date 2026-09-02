import { useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import PillButton from '../../../components/ui/PillButton';
import { BRANCH_DETAILS } from '../../../mock-data/db';
import { useToast } from '../../../hooks/useToast';
import { Printer, MessageCircle, X } from 'lucide-react';
import { format } from 'date-fns';

export default function InvoicePreviewModal({ saleData, onClose }) {
  const printRef = useRef(null);
  const { success: toastSuccess } = useToast();

  const branchMeta = BRANCH_DETAILS[saleData.branch] || BRANCH_DETAILS.kochi;
  
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const target = saleData.customer.name || saleData.customer.mobile || 'customer';
    toastSuccess(`WhatsApp invoice sent to ${target}`);
  };

  return (
    <Modal title="Invoice Preview" isOpen={true} onClose={onClose} size="xl">
      <div className="invoice-container">
        {/* The actual printable area */}
        <div 
          ref={printRef} 
          className="printable-invoice"
          style={{ 
            background: '#fff', 
            color: '#111', 
            padding: '40px', 
            borderRadius: '8px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        >
          {/* Header - A4 Style */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #222', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#000', textTransform: 'uppercase' }}>{branchMeta.tradeName}</h2>
              <div style={{ color: '#444' }}>{branchMeta.address}</div>
              <div style={{ color: '#444' }}>Phone: {branchMeta.phone}</div>
              <div style={{ color: '#444', fontWeight: '600', marginTop: '4px' }}>GSTIN: {branchMeta.gstin}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '300', color: '#666', textTransform: 'uppercase', letterSpacing: '2px' }}>TAX INVOICE</h1>
              <div><strong>Inv No:</strong> <span style={{ marginLeft: '8px' }}>{saleData.invoiceNumber}</span></div>
              <div><strong>Date:</strong> <span style={{ marginLeft: '8px' }}>{format(new Date(saleData.date), 'dd/MM/yyyy')}</span></div>
              <div><strong>Time:</strong> <span style={{ marginLeft: '8px' }}>{format(new Date(saleData.date), 'hh:mm a')}</span></div>
            </div>
          </div>

          {/* Meta Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', background: '#f9f9f9', padding: '16px', borderRadius: '4px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Billed To:</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{saleData.customer.name || 'Walk-in Customer'}</div>
              <div>Mobile: {saleData.customer.mobile}</div>
              {saleData.customer.gstin && <div>GSTIN: {saleData.customer.gstin}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Cashier:</div>
              <div>Demo Admin</div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #222', textAlign: 'left', background: '#f1f1f1' }}>
                <th style={{ padding: '12px 8px' }}>#</th>
                <th style={{ padding: '12px 8px' }}>Item Description</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Unit Rate</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>GST</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {saleData.summary.lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '16px 8px', verticalAlign: 'top', color: '#666' }}>{i + 1}</td>
                  <td style={{ padding: '16px 8px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>HSN: {item.hsnCode}</div>
                    {item.imeis && item.imeis.length > 0 && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>IMEI: {item.imeis.join(', ')}</div>
                    )}
                    {item.discountAmount > 0 && (
                      <div style={{ fontSize: '12px', color: '#d9534f', marginTop: '2px' }}>Includes Discount: ₹{item.discountAmount.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold' }}>{item.quantity}</td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', verticalAlign: 'top' }}>₹{item.unitRate.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', verticalAlign: 'top', fontSize: '12px' }}>
                    <div>CGST: ₹{item.cgstAmount.toLocaleString('en-IN')}</div>
                    <div>SGST: ₹{item.sgstAmount.toLocaleString('en-IN')}</div>
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>₹{item.netTotal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <div style={{ width: '350px', background: '#f9f9f9', padding: '16px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#555' }}>Gross Amount:</span>
                <span>₹{saleData.summary.grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#d9534f' }}>
                <span>Total Discount:</span>
                <span>-₹{saleData.summary.totalDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#555' }}>Taxable Value:</span>
                <span>₹{saleData.summary.taxableValue.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#555' }}>CGST:</span>
                <span>₹{saleData.summary.totalCGST.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#555' }}>SGST:</span>
                <span>₹{saleData.summary.totalSGST.toLocaleString('en-IN')}</span>
              </div>
              {saleData.summary.roundingAdjustment !== 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#555' }}>Rounding:</span>
                  <span>₹{saleData.summary.roundingAdjustment}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '20px', marginTop: '16px', borderTop: '2px solid #222', paddingTop: '16px' }}>
                <span>GRAND TOTAL:</span>
                <span>₹{saleData.summary.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '24px', fontSize: '11px', color: '#666' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>TERMS & CONDITIONS</div>
            <ul style={{ paddingLeft: '16px', margin: '0 0 16px 0' }}>
              <li style={{ marginBottom: '4px' }}>Goods once sold will not be taken back or exchanged.</li>
              <li style={{ marginBottom: '4px' }}>Warranty claims are subject to the respective manufacturer's terms and conditions.</li>
              <li style={{ marginBottom: '4px' }}>Please retain this original invoice for any future warranty claims. Physical damage is not covered under warranty.</li>
            </ul>
            <div style={{ textAlign: 'center', marginTop: '32px', fontWeight: 'bold', fontSize: '14px', color: '#111' }}>
              Thank you for shopping with {branchMeta.tradeName}!
            </div>
          </div>
        </div>

        {/* Actions (Not printable) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <PillButton variant="secondary" onClick={onClose} icon={X}>Close</PillButton>
          <PillButton variant="primary" onClick={handleWhatsApp} icon={MessageCircle} style={{ background: '#25D366', color: '#fff' }}>WhatsApp</PillButton>
          <PillButton variant="primary" onClick={handlePrint} icon={Printer}>Print A4 Bill</PillButton>
        </div>
      </div>
    </Modal>
  );
}
