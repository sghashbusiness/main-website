/**
 * SGHASH Service Layer — Inventory
 * 
 * Stock operations: search, add, bulk upload, transfers.
 * All functions are async for backend-ready architecture.
 */

import {
  inventory,
  findByIMEI,
  findBySKU,
  isIMEIDuplicate,
  getTotalStock,
} from '../mock-data/inventory';
import {
  transfers,
  getActiveTransfers,
  getPendingShipments,
  TRANSFER_STATUSES,
} from '../mock-data/transfers';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Search inventory by IMEI or SKU.
 * Architecture Spec §4.1: "<GlobalSearch>: A rapid IMEI/SKU lookup."
 */
export async function searchInventory(query) {
  await delay(200 + Math.random() * 200);

  const trimmed = query.trim();
  if (!trimmed) {
    return { success: true, data: [], error: null };
  }

  // Check if it's an IMEI (15 digits)
  if (/^\d{15}$/.test(trimmed)) {
    const result = findByIMEI(trimmed);
    if (result) {
      return {
        success: true,
        data: [{
          ...result.product,
          matchedIMEI: result.imeiRecord,
          totalStock: getTotalStock(result.product),
        }],
        error: null,
      };
    }
    return { success: true, data: [], error: null };
  }

  // Otherwise search by SKU or name
  const lower = trimmed.toLowerCase();
  const results = inventory
    .filter(
      (p) =>
        p.sku.toLowerCase().includes(lower) ||
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower)
    )
    .map((p) => ({ ...p, totalStock: getTotalStock(p) }));

  return { success: true, data: results, error: null };
}

/**
 * Get full inventory listing for a branch or all branches.
 * Architecture Spec §3.3: "<ConsolidatedInventoryGrid>: A master data table
 * mapping every SKU to its total company stock, with adjacent columns detailing
 * the exact unit count physically held at each individual branch."
 */
export async function getInventory(branch = 'all') {
  await delay(400 + Math.random() * 300);

  const items = inventory.map((product) => ({
    sku: product.sku,
    name: product.name,
    brand: product.brand,
    color: product.color,
    category: product.category,
    totalStock: getTotalStock(product),
    stock: { ...product.stock },
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
  }));

  return { success: true, data: items, error: null };
}

/**
 * Add a single stock item manually.
 * Architecture Spec §4.2: "<ManualEntryGrid>: A dynamic form table for
 * single-unit processing."
 */
export async function addStockItem(item) {
  await delay(600 + Math.random() * 300);

  // Validate IMEI uniqueness
  if (isIMEIDuplicate(item.imei)) {
    return {
      success: false,
      data: null,
      error: `IMEI ${item.imei} already exists in inventory.`,
    };
  }

  // Validate IMEI format
  if (!/^\d{15}$/.test(item.imei)) {
    return {
      success: false,
      data: null,
      error: 'IMEI must be exactly 15 digits.',
    };
  }

  // Simulate adding to inventory
  return {
    success: true,
    data: { message: 'Stock item added successfully.', item },
    error: null,
  };
}

/**
 * Bulk add stock items.
 * Architecture Spec §4.2: "<BulkUploadAction>: Triggers a <WarningModal>
 * that strictly defines the mandatory Excel/CSV column headers."
 */
export async function bulkUploadStock(items) {
  await delay(1500 + Math.random() * 500);

  const errors = [];
  const successes = [];

  for (const item of items) {
    if (isIMEIDuplicate(item.imei)) {
      errors.push({ imei: item.imei, error: 'Duplicate IMEI' });
    } else if (!/^\d{15}$/.test(item.imei)) {
      errors.push({ imei: item.imei, error: 'Invalid IMEI format' });
    } else {
      successes.push(item);
    }
  }

  return {
    success: errors.length === 0,
    data: {
      imported: successes.length,
      failed: errors.length,
      errors,
    },
    error: errors.length > 0 ? `${errors.length} item(s) failed validation.` : null,
  };
}

/**
 * Get active inter-store transfers.
 */
export async function getTransfers() {
  await delay(300 + Math.random() * 200);
  return { success: true, data: getActiveTransfers(), error: null };
}

/**
 * Get pending shipments for a branch.
 */
export async function getBranchPendingShipments(branch) {
  await delay(300 + Math.random() * 200);
  return { success: true, data: getPendingShipments(branch), error: null };
}

/**
 * Request stock from another branch.
 * Architecture Spec §4.3: "<RequestStockModal> (asking another branch for units)."
 */
export async function requestStock(fromBranch, toBranch, items) {
  await delay(800 + Math.random() * 400);

  const newTransfer = {
    id: `TRF-${Date.now()}`,
    date: new Date().toISOString(),
    sourceBranch: fromBranch,
    destinationBranch: toBranch,
    items,
    status: TRANSFER_STATUSES.REQUESTED,
    requestedBy: 'Current User',
    approvedBy: null,
    notes: '',
  };

  return {
    success: true,
    data: { transfer: newTransfer, message: 'Stock request submitted successfully.' },
    error: null,
  };
}

/**
 * Send stock to another branch.
 * Architecture Spec §4.3: "<SendStockModal> (scanning local IMEIs to dispatch elsewhere)."
 */
export async function sendStock(fromBranch, toBranch, imeis) {
  await delay(800 + Math.random() * 400);

  return {
    success: true,
    data: { message: `${imeis.length} unit(s) dispatched from ${fromBranch} to ${toBranch}.` },
    error: null,
  };
}

/**
 * Accept/verify pending shipment.
 * Architecture Spec §4.3: "clicks 'Accept/Verify IMEIs'."
 */
export async function verifyShipment(transferId, verifiedImeis) {
  await delay(800 + Math.random() * 400);

  return {
    success: true,
    data: { message: 'Shipment verified and accepted. Stock has been added to your branch.' },
    error: null,
  };
}

/**
 * Force approve a stalled transfer (owner action).
 * Architecture Spec §3.3: "featuring a high-level 'Force Approve' action."
 */
export async function forceApproveTransfer(transferId) {
  await delay(600 + Math.random() * 300);

  return {
    success: true,
    data: { message: 'Transfer has been force-approved.' },
    error: null,
  };
}
