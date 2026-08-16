/**
 * SGHASH — BillSummaryPanel
 */

export default function BillSummaryPanel({ summary }) {
  const SummaryRow = ({ label, value, bold, isTotal, color }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: isTotal ? 'var(--space-md) 0 0 0' : 'var(--space-xs) 0',
      borderTop: isTotal ? '1px dashed var(--color-border)' : 'none',
      marginTop: isTotal ? 'var(--space-xs)' : 0,
      fontWeight: bold || isTotal ? 600 : 400,
      fontSize: isTotal ? 'var(--font-size-xl)' : 'var(--font-size-sm)',
      color: color || (isTotal ? 'var(--color-primary-dark)' : 'inherit')
    }}>
      <span>{label}</span>
      <span>₹{value.toLocaleString('en-IN', { minimumFractionDigits: isTotal ? 0 : 2, maximumFractionDigits: 2 })}</span>
    </div>
  );

  return (
    <div className="pos-panel">
      <div className="pos-panel__title" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 'var(--space-sm)' }}>
        Bill Summary ({summary.itemCount} Items)
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <SummaryRow label="Gross Amount" value={summary.grossAmount} />
        <SummaryRow label="Total Discount" value={-summary.totalDiscount} color="var(--color-danger)" />
        <SummaryRow label="Taxable Value" value={summary.taxableValue} bold />
        
        <div style={{ marginTop: 'var(--space-sm)' }}></div>
        
        <SummaryRow label="Total CGST" value={summary.totalCGST} />
        <SummaryRow label="Total SGST" value={summary.totalSGST} />
        <SummaryRow label="Rounding" value={summary.roundingAdjustment} />
        
        <SummaryRow label="Grand Total" value={summary.grandTotal} isTotal />
      </div>
    </div>
  );
}
