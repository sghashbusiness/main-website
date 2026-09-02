/**
 * SGHASH Service Layer — POS (Point of Sale)
 * 
 * IMEI scanning, cart management, billing, and checkout.
 * All functions are async for backend-ready architecture.
 */

import { findByIMEI, GST_RATES } from '../mock-data/db';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resolve a scanned IMEI to a product.
 * Architecture Spec §5.2: "<IMEIScannerBar>: Scanning a 15-digit IMEI
 * automatically resolves the product, adds a row to the cart, and locks
 * the inventory row to prevent concurrent double-selling."
 */
export async function resolveIMEI(imei, currentBranch) {
  await delay(150 + Math.random() * 100);

  if (!/^\d{15}$/.test(imei)) {
    return {
      success: false,
      data: null,
      error: 'Invalid IMEI format. Must be exactly 15 digits.',
    };
  }

  const result = findByIMEI(imei);
  if (!result) {
    return {
      success: false,
      data: null,
      error: `IMEI ${imei} not found in inventory.`,
    };
  }

  const { product, imeiRecord } = result;

  if (imeiRecord.status === 'sold') {
    return {
      success: false,
      data: null,
      error: `IMEI ${imei} has already been sold.`,
    };
  }

  if (imeiRecord.branch !== currentBranch) {
    return {
      success: false,
      data: null,
      error: `IMEI ${imei} is at ${imeiRecord.branch} branch, not ${currentBranch}.`,
    };
  }

  const gstRate = GST_RATES[product.gstKey];

  return {
    success: true,
    data: {
      imei: imeiRecord.imei,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      color: product.color,
      hsnCode: product.hsnCode,
      unitRate: product.sellingPrice,
      costPrice: product.costPrice,
      gstRate: gstRate.rate,
      cgstRate: gstRate.cgst,
      sgstRate: gstRate.sgst,
      category: product.category,
    },
    error: null,
  };
}

/**
 * Calculate line-item totals with GST.
 * GST rates come from the product's category — NOT a flat rate.
 * 
 * Architecture Spec §5.2: "inline Discount fields, dynamic GST Tax Splits,
 * and the Net Total per line."
 */
export function calculateLineItem(item) {
  const discountedPrice = item.unitRate - (item.discount || 0);
  const taxableValue = +(discountedPrice / (1 + item.gstRate / 100)).toFixed(2);
  const cgstAmount = +(taxableValue * item.cgstRate / 100).toFixed(2);
  const sgstAmount = +(taxableValue * item.sgstRate / 100).toFixed(2);
  const netTotal = +(taxableValue + cgstAmount + sgstAmount).toFixed(2);

  return {
    ...item,
    discountedPrice,
    taxableValue,
    cgstAmount,
    sgstAmount,
    netTotal,
  };
}

/**
 * Calculate bill summary from cart items.
 * Architecture Spec §5.3: "<BillSummaryPanel>: Auto-calculates Gross Amount,
 * overall Store Discounts, Taxable Value, CGST/SGST splits, rounding
 * adjustments, and the final Grand Total."
 */
export function calculateBillSummary(cartItems) {
  const lineItems = cartItems.map(calculateLineItem);

  const grossAmount = lineItems.reduce((sum, item) => sum + item.unitRate, 0);
  const totalDiscount = lineItems.reduce((sum, item) => sum + (item.discount || 0), 0);
  const taxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);
  const totalCGST = lineItems.reduce((sum, item) => sum + item.cgstAmount, 0);
  const totalSGST = lineItems.reduce((sum, item) => sum + item.sgstAmount, 0);
  const subTotal = +(taxableValue + totalCGST + totalSGST).toFixed(2);
  const roundingAdjustment = +(Math.round(subTotal) - subTotal).toFixed(2);
  const grandTotal = Math.round(subTotal);

  return {
    lineItems,
    grossAmount,
    totalDiscount,
    taxableValue: +taxableValue.toFixed(2),
    totalCGST: +totalCGST.toFixed(2),
    totalSGST: +totalSGST.toFixed(2),
    subTotal,
    roundingAdjustment,
    grandTotal,
    itemCount: lineItems.length,
  };
}

/**
 * Calculate change due for cash payments.
 */
export function calculateChangeDue(grandTotal, cashReceived) {
  return Math.max(0, cashReceived - grandTotal);
}

/**
 * Complete a sale transaction.
 * Architecture Spec §5.3: "<CompleteSaleButton>: Commits the record,
 * shifts the IMEI status to 'Sold,' and fires the asynchronous WhatsApp
 * invoice webhook."
 */
export async function completeSale(saleData) {
  await delay(1000 + Math.random() * 500);

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  return {
    success: true,
    data: {
      invoiceNumber,
      message: 'Sale completed successfully.',
      imeiStatusUpdated: saleData.items.length,
      webhookFired: saleData.deliveryMethod === 'whatsapp',
    },
    error: null,
  };
}

/**
 * Fire WhatsApp invoice webhook (simulated).
 */
export async function fireInvoiceWebhook(invoiceId, customerPhone) {
  await delay(500 + Math.random() * 300);

  return {
    success: true,
    data: {
      message: `WhatsApp e-invoice sent to ${customerPhone}.`,
      webhookId: `wh_${Date.now()}`,
    },
    error: null,
  };
}
