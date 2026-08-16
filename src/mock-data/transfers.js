/**
 * SGHASH Mock Data — Inter-Store Transfers
 * 
 * Architecture Spec §3.3: "A live feed of active inter-store transfers
 * (Date, Source, Destination, Items) featuring a 'Force Approve' action."
 * 
 * Architecture Spec §4.3: "<PendingShipmentsQueue>: Units transferred from
 * another branch remain here in a pending state until the manager physically
 * verifies the hardware and clicks 'Accept/Verify IMEIs'."
 */

export const TRANSFER_STATUSES = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
  IN_TRANSIT: 'in_transit',
  PENDING_VERIFICATION: 'pending_verification',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export const TRANSFER_STATUS_LABELS = {
  [TRANSFER_STATUSES.REQUESTED]: 'Requested',
  [TRANSFER_STATUSES.APPROVED]: 'Approved',
  [TRANSFER_STATUSES.IN_TRANSIT]: 'In Transit',
  [TRANSFER_STATUSES.PENDING_VERIFICATION]: 'Pending Verification',
  [TRANSFER_STATUSES.COMPLETED]: 'Completed',
  [TRANSFER_STATUSES.REJECTED]: 'Rejected',
};

export const transfers = [
  {
    id: 'TRF-001',
    date: '2026-08-15T10:00:00+05:30',
    sourceBranch: 'kochi',
    destinationBranch: 'trivandrum',
    items: [
      { sku: 'SAM-S24U-256-BLK', name: 'Samsung Galaxy S24 Ultra', quantity: 2, imeis: ['354678901234567', '354678901234568'] },
    ],
    status: TRANSFER_STATUSES.IN_TRANSIT,
    requestedBy: 'Anil Kumar S',
    approvedBy: 'Rajesh Menon',
    notes: 'Urgent stock replenishment for Trivandrum branch',
  },
  {
    id: 'TRF-002',
    date: '2026-08-14T14:30:00+05:30',
    sourceBranch: 'thrissur',
    destinationBranch: 'kochi',
    items: [
      { sku: 'OP-12-256-GRN', name: 'OnePlus 12', quantity: 1, imeis: ['867530012345610'] },
      { sku: 'VIV-V30P-256-RED', name: 'Vivo V30 Pro', quantity: 1, imeis: ['862345678901012'] },
    ],
    status: TRANSFER_STATUSES.PENDING_VERIFICATION,
    requestedBy: 'Priya Nair',
    approvedBy: 'Rajesh Menon',
    notes: 'Customer pre-order fulfillment',
  },
  {
    id: 'TRF-003',
    date: '2026-08-14T09:15:00+05:30',
    sourceBranch: 'kochi',
    destinationBranch: 'thrissur',
    items: [
      { sku: 'SAM-A55-128-BLU', name: 'Samsung Galaxy A55 5G', quantity: 3, imeis: ['351234567890001', '351234567890002', '351234567890003'] },
    ],
    status: TRANSFER_STATUSES.COMPLETED,
    requestedBy: 'Suresh P',
    approvedBy: 'Rajesh Menon',
    notes: 'Regular monthly restock',
  },
  {
    id: 'TRF-004',
    date: '2026-08-13T16:45:00+05:30',
    sourceBranch: 'webstore',
    destinationBranch: 'trivandrum',
    items: [
      { sku: 'APL-IP16P-256-NAT', name: 'Apple iPhone 16 Pro', quantity: 1, imeis: ['353456789012307'] },
    ],
    status: TRANSFER_STATUSES.REQUESTED,
    requestedBy: 'Anil Kumar S',
    approvedBy: null,
    notes: 'High-value customer request — awaiting owner approval',
  },
  {
    id: 'TRF-005',
    date: '2026-08-13T11:30:00+05:30',
    sourceBranch: 'trivandrum',
    destinationBranch: 'kochi',
    items: [
      { sku: 'MI-14-256-BLK', name: 'Xiaomi 14', quantity: 2, imeis: ['869012345678005', '869012345678006'] },
    ],
    status: TRANSFER_STATUSES.APPROVED,
    requestedBy: 'Priya Nair',
    approvedBy: 'Rajesh Menon',
    notes: 'Stock rebalancing',
  },
  {
    id: 'TRF-006',
    date: '2026-08-12T13:00:00+05:30',
    sourceBranch: 'kochi',
    destinationBranch: 'webstore',
    items: [
      { sku: 'SAM-GW6-44-SLV', name: 'Samsung Galaxy Watch 6 (44mm)', quantity: 1, imeis: ['356789012345601'] },
    ],
    status: TRANSFER_STATUSES.COMPLETED,
    requestedBy: 'Webstore Admin',
    approvedBy: 'Rajesh Menon',
    notes: 'Online listing stock allocation',
  },
  {
    id: 'TRF-007',
    date: '2026-08-12T08:30:00+05:30',
    sourceBranch: 'thrissur',
    destinationBranch: 'trivandrum',
    items: [
      { sku: 'VIV-V30P-256-RED', name: 'Vivo V30 Pro', quantity: 2, imeis: ['862345678901013', '862345678901014'] },
    ],
    status: TRANSFER_STATUSES.REJECTED,
    requestedBy: 'Anil Kumar S',
    approvedBy: null,
    notes: 'Rejected — Thrissur branch stock below minimum threshold',
  },
  {
    id: 'TRF-008',
    date: '2026-08-11T15:20:00+05:30',
    sourceBranch: 'kochi',
    destinationBranch: 'thrissur',
    items: [
      { sku: 'NOK-105-DS-BLK', name: 'Nokia 105 Dual SIM', quantity: 5, imeis: ['359876543210001', '359876543210002', '359876543210003', '359876543210004', '359876543210005'] },
    ],
    status: TRANSFER_STATUSES.PENDING_VERIFICATION,
    requestedBy: 'Suresh P',
    approvedBy: 'Rajesh Menon',
    notes: 'Festival season pre-stock',
  },
];

/**
 * Get active (non-completed, non-rejected) transfers.
 */
export function getActiveTransfers() {
  return transfers.filter(
    (t) =>
      t.status !== TRANSFER_STATUSES.COMPLETED &&
      t.status !== TRANSFER_STATUSES.REJECTED
  );
}

/**
 * Get pending shipments for a specific branch (as destination).
 * These are transfers that need physical verification.
 */
export function getPendingShipments(branch) {
  return transfers.filter(
    (t) =>
      t.destinationBranch === branch &&
      t.status === TRANSFER_STATUSES.PENDING_VERIFICATION
  );
}

/**
 * Get transfers requested from a specific branch (as source).
 */
export function getOutgoingTransfers(branch) {
  return transfers.filter((t) => t.sourceBranch === branch);
}
