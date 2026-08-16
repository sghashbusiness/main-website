/**
 * SGHASH — POSPage
 * Fast POS & Checkout
 */

import { useState } from 'react';
import { useBranch } from '../../hooks/useBranch';
import { useToast } from '../../hooks/useToast';
import { resolveIMEI, calculateBillSummary, completeSale, fireInvoiceWebhook } from '../../services/posService';
import StoreMetaCard from './components/StoreMetaCard';
import CustomerInfoContainer from './components/CustomerInfoContainer';
import InvoiceDeliveryToggle from './components/InvoiceDeliveryToggle';
import IMEIScannerBar from './components/IMEIScannerBar';
import BillingItemsTable from './components/BillingItemsTable';
import BillSummaryPanel from './components/BillSummaryPanel';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import PillButton from '../../components/ui/PillButton';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import './POSPage.css';

export default function POSPage() {
  const { selectedBranch } = useBranch();
  const { success: toastSuccess, error: toastError } = useToast();

  const [customerInfo, setCustomerInfo] = useState({ mobile: '', name: '', gstin: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('whatsapp');
  const [cartItems, setCartItems] = useState([]);
  const [payment, setPayment] = useState({ method: 'cash', cashReceived: '', splitAmounts: { cash: 0, upi: 0, card: 0 } });
  const [loading, setLoading] = useState(false);

  const billSummary = calculateBillSummary(cartItems);

  const handleAddToCart = async (imei) => {
    if (cartItems.some(i => i.imei === imei)) {
      toastError(`IMEI ${imei} is already in the cart.`);
      return;
    }

    setLoading(true);
    const res = await resolveIMEI(imei, selectedBranch);
    setLoading(false);

    if (res.success) {
      setCartItems([{ ...res.data, id: Date.now(), discount: 0 }, ...cartItems]);
    } else {
      toastError(res.error);
    }
  };

  const handleUpdateItemDiscount = (id, discount) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, discount } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) return toastError("Cart is empty.");
    if (!customerInfo.mobile || customerInfo.mobile.length < 10) return toastError("Valid customer mobile number is required.");
    
    if (payment.method === 'cash') {
      const received = parseFloat(payment.cashReceived) || 0;
      if (received < billSummary.grandTotal) return toastError("Insufficient cash received.");
    } else if (payment.method === 'split') {
      const splitTotal = (parseFloat(payment.splitAmounts.cash) || 0) + 
                         (parseFloat(payment.splitAmounts.upi) || 0) + 
                         (parseFloat(payment.splitAmounts.card) || 0);
      if (Math.abs(splitTotal - billSummary.grandTotal) > 0.01) {
        return toastError("Split tender total must exactly match the Grand Total.");
      }
    }

    setLoading(true);
    const saleData = {
      customer: customerInfo,
      items: cartItems,
      summary: billSummary,
      payment,
      deliveryMethod,
      branch: selectedBranch
    };

    const res = await completeSale(saleData);
    
    if (res.success) {
      toastSuccess(`Sale completed! Invoice: ${res.data.invoiceNumber}`);
      
      if (deliveryMethod === 'whatsapp') {
        const whRes = await fireInvoiceWebhook(res.data.invoiceNumber, customerInfo.mobile);
        if (whRes.success) toastSuccess(whRes.data.message);
      } else {
        toastSuccess('Thermal print initiated.');
      }

      // Reset
      setCartItems([]);
      setCustomerInfo({ mobile: '', name: '', gstin: '' });
      setPayment({ method: 'cash', cashReceived: '', splitAmounts: { cash: 0, upi: 0, card: 0 } });
    } else {
      toastError(res.error || "Failed to complete sale.");
    }
    setLoading(false);
  };

  return (
    <div className="pos-page anim-fade-in">
      <div className="pos-page__header">
        <h1 className="text-page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <ShoppingCart size={28} className="text-primary" />
          Terminal Checkout
        </h1>
      </div>

      <div className="pos-page__grid">
        <div className="pos-page__main">
          <StoreMetaCard branch={selectedBranch} />
          
          <div className="pos-panel">
            <IMEIScannerBar onScan={handleAddToCart} loading={loading} />
            <BillingItemsTable 
              items={billSummary.lineItems} 
              onRemove={handleRemoveItem} 
              onUpdateDiscount={handleUpdateItemDiscount} 
            />
          </div>
        </div>

        <div className="pos-page__sidebar">
          <CustomerInfoContainer customer={customerInfo} setCustomer={setCustomerInfo} />
          <InvoiceDeliveryToggle value={deliveryMethod} onChange={setDeliveryMethod} />
          <BillSummaryPanel summary={billSummary} />
          <PaymentMethodSelector 
            summary={billSummary} 
            payment={payment} 
            setPayment={setPayment} 
          />
          
          <div style={{ marginTop: 'var(--space-md)' }}>
            <PillButton 
              fullWidth 
              size="lg"
              variant="primary" 
              icon={CheckCircle}
              onClick={handleCompleteSale}
              disabled={loading || cartItems.length === 0}
              loading={loading}
              style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}
            >
              Complete Sale
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
