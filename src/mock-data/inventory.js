/**
 * SGHASH Mock Data — Inventory
 * 
 * SKUs with per-branch stock counts, IMEI arrays, and category-level GST rates.
 * GST rates are structured per the user's requirement: each product category
 * carries its own GST rate, and the calculation engine derives CGST/SGST from it.
 * 
 * Architecture Spec §4.2: "Mandatory Excel/CSV column headers:
 * SKU, Color, 15-digit IMEI, Cost Price, Selling Price"
 */

/**
 * GST Rate Slabs — Category-level GST rates.
 * Structured so additional rates can be added without changing calculation logic.
 */
export const GST_RATES = {
  MOBILE_PHONES: { rate: 18, cgst: 9, sgst: 9, label: 'Mobile Phones (18%)' },
  ACCESSORIES: { rate: 18, cgst: 9, sgst: 9, label: 'Accessories (18%)' },
  CHARGERS_ADAPTERS: { rate: 18, cgst: 9, sgst: 9, label: 'Chargers & Adapters (18%)' },
  SCREEN_PROTECTORS: { rate: 28, cgst: 14, sgst: 14, label: 'Tempered Glass (28%)' },
  EARPHONES: { rate: 18, cgst: 9, sgst: 9, label: 'Earphones (18%)' },
  POWER_BANKS: { rate: 18, cgst: 9, sgst: 9, label: 'Power Banks (18%)' },
  CASES_COVERS: { rate: 18, cgst: 9, sgst: 9, label: 'Cases & Covers (18%)' },
  TABLETS: { rate: 18, cgst: 9, sgst: 9, label: 'Tablets (18%)' },
  SMARTWATCHES: { rate: 12, cgst: 6, sgst: 6, label: 'Smart Watches (12%)' },
  FEATURE_PHONES: { rate: 12, cgst: 6, sgst: 6, label: 'Feature Phones (12%)' },
};

/**
 * Product categories for organizing SKUs.
 */
export const PRODUCT_CATEGORIES = [
  { id: 'mobile_phones', label: 'Mobile Phones', gstKey: 'MOBILE_PHONES' },
  { id: 'feature_phones', label: 'Feature Phones', gstKey: 'FEATURE_PHONES' },
  { id: 'tablets', label: 'Tablets', gstKey: 'TABLETS' },
  { id: 'smartwatches', label: 'Smart Watches', gstKey: 'SMARTWATCHES' },
  { id: 'accessories', label: 'Accessories', gstKey: 'ACCESSORIES' },
  { id: 'chargers', label: 'Chargers & Adapters', gstKey: 'CHARGERS_ADAPTERS' },
  { id: 'screen_protectors', label: 'Screen Protectors', gstKey: 'SCREEN_PROTECTORS' },
  { id: 'earphones', label: 'Earphones', gstKey: 'EARPHONES' },
  { id: 'power_banks', label: 'Power Banks', gstKey: 'POWER_BANKS' },
  { id: 'cases_covers', label: 'Cases & Covers', gstKey: 'CASES_COVERS' },
];

export const BRANCHES = ['kochi', 'trivandrum', 'thrissur', 'webstore'];

export const BRANCH_LABELS = {
  all: 'All Branches (Consolidated)',
  kochi: 'Kochi',
  trivandrum: 'Trivandrum',
  thrissur: 'Thrissur',
  webstore: 'Webstore',
};

/**
 * Branch store metadata — used by POS module's <StoreMetaCard>
 * Architecture Spec §5.1: "Trade Name, Physical Address, and GSTIN"
 */
export const BRANCH_DETAILS = {
  kochi: {
    tradeName: 'SABARI GADGET HASH — Kochi',
    address: 'Ground Floor, Lulu Cyber Tower, Infopark SEZ, Kakkanad, Kochi, Kerala 682042',
    gstin: '32AABCS1234F1ZP',
    phone: '+91 484 404 1234',
  },
  trivandrum: {
    tradeName: 'SABARI GADGET HASH — Trivandrum',
    address: 'TC 25/321-1, Near Secretariat, MG Road, Thiruvananthapuram, Kerala 695001',
    gstin: '32AABCS1234F2ZQ',
    phone: '+91 471 233 5678',
  },
  thrissur: {
    tradeName: 'SABARI GADGET HASH — Thrissur',
    address: 'Shop No.12, City Centre Mall, Shornur Road, Thrissur, Kerala 680001',
    gstin: '32AABCS1234F3ZR',
    phone: '+91 487 242 9012',
  },
  webstore: {
    tradeName: 'SABARI GADGET HASH — Online',
    address: 'Digital Operations, Infopark SEZ, Kakkanad, Kochi, Kerala 682042',
    gstin: '32AABCS1234F4ZS',
    phone: '+91 484 404 5555',
  },
};

/**
 * HSN Codes for product categories — required on GST invoices.
 */
const HSN_CODES = {
  MOBILE_PHONES: '8517',
  FEATURE_PHONES: '8517',
  TABLETS: '8471',
  SMARTWATCHES: '9102',
  ACCESSORIES: '8544',
  CHARGERS_ADAPTERS: '8504',
  SCREEN_PROTECTORS: '7007',
  EARPHONES: '8518',
  POWER_BANKS: '8507',
  CASES_COVERS: '4202',
};

/**
 * SKU inventory with per-branch stock and IMEI arrays.
 * Each IMEI is exactly 15 digits as per spec §4.2.
 */
export const inventory = [
  // ── Samsung ─────────────────────────────────────────────────────────
  {
    sku: 'SAM-S24U-256-BLK',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'mobile_phones',
    gstKey: 'MOBILE_PHONES',
    hsnCode: HSN_CODES.MOBILE_PHONES,
    color: 'Titanium Black',
    storage: '256GB',
    costPrice: 109999,
    sellingPrice: 134999,
    stock: {
      kochi: 4,
      trivandrum: 3,
      thrissur: 2,
      webstore: 6,
    },
    imeis: [
      { imei: '354678901234567', branch: 'kochi', status: 'available' },
      { imei: '354678901234568', branch: 'kochi', status: 'available' },
      { imei: '354678901234569', branch: 'kochi', status: 'sold' },
      { imei: '354678901234570', branch: 'kochi', status: 'available' },
      { imei: '354678901234571', branch: 'trivandrum', status: 'available' },
      { imei: '354678901234572', branch: 'trivandrum', status: 'available' },
      { imei: '354678901234573', branch: 'trivandrum', status: 'available' },
      { imei: '354678901234574', branch: 'thrissur', status: 'available' },
      { imei: '354678901234575', branch: 'thrissur', status: 'available' },
      { imei: '354678901234576', branch: 'webstore', status: 'available' },
      { imei: '354678901234577', branch: 'webstore', status: 'available' },
      { imei: '354678901234578', branch: 'webstore', status: 'available' },
      { imei: '354678901234579', branch: 'webstore', status: 'available' },
      { imei: '354678901234580', branch: 'webstore', status: 'available' },
      { imei: '354678901234581', branch: 'webstore', status: 'available' },
    ],
  },
  {
    sku: 'SAM-A55-128-BLU',
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    category: 'mobile_phones',
    gstKey: 'MOBILE_PHONES',
    hsnCode: HSN_CODES.MOBILE_PHONES,
    color: 'Awesome Iceblue',
    storage: '128GB',
    costPrice: 29999,
    sellingPrice: 39999,
    stock: {
      kochi: 8,
      trivandrum: 6,
      thrissur: 5,
      webstore: 10,
    },
    imeis: [
      { imei: '351234567890001', branch: 'kochi', status: 'available' },
      { imei: '351234567890002', branch: 'kochi', status: 'available' },
      { imei: '351234567890003', branch: 'kochi', status: 'available' },
      { imei: '351234567890004', branch: 'kochi', status: 'available' },
      { imei: '351234567890005', branch: 'kochi', status: 'available' },
      { imei: '351234567890006', branch: 'kochi', status: 'sold' },
      { imei: '351234567890007', branch: 'kochi', status: 'available' },
      { imei: '351234567890008', branch: 'kochi', status: 'available' },
      { imei: '351234567890009', branch: 'trivandrum', status: 'available' },
      { imei: '351234567890010', branch: 'trivandrum', status: 'available' },
      { imei: '351234567890011', branch: 'trivandrum', status: 'available' },
      { imei: '351234567890012', branch: 'trivandrum', status: 'available' },
      { imei: '351234567890013', branch: 'trivandrum', status: 'available' },
      { imei: '351234567890014', branch: 'trivandrum', status: 'available' },
      { imei: '351234567890015', branch: 'thrissur', status: 'available' },
      { imei: '351234567890016', branch: 'thrissur', status: 'available' },
      { imei: '351234567890017', branch: 'thrissur', status: 'available' },
      { imei: '351234567890018', branch: 'thrissur', status: 'available' },
      { imei: '351234567890019', branch: 'thrissur', status: 'available' },
      { imei: '351234567890020', branch: 'webstore', status: 'available' },
      { imei: '351234567890021', branch: 'webstore', status: 'available' },
      { imei: '351234567890022', branch: 'webstore', status: 'available' },
      { imei: '351234567890023', branch: 'webstore', status: 'available' },
      { imei: '351234567890024', branch: 'webstore', status: 'available' },
      { imei: '351234567890025', branch: 'webstore', status: 'available' },
      { imei: '351234567890026', branch: 'webstore', status: 'available' },
      { imei: '351234567890027', branch: 'webstore', status: 'available' },
      { imei: '351234567890028', branch: 'webstore', status: 'available' },
      { imei: '351234567890029', branch: 'webstore', status: 'available' },
    ],
  },

  // ── OnePlus ─────────────────────────────────────────────────────────
  {
    sku: 'OP-12-256-GRN',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'mobile_phones',
    gstKey: 'MOBILE_PHONES',
    hsnCode: HSN_CODES.MOBILE_PHONES,
    color: 'Flowy Emerald',
    storage: '256GB',
    costPrice: 54999,
    sellingPrice: 69999,
    stock: {
      kochi: 5,
      trivandrum: 4,
      thrissur: 3,
      webstore: 7,
    },
    imeis: [
      { imei: '867530012345601', branch: 'kochi', status: 'available' },
      { imei: '867530012345602', branch: 'kochi', status: 'available' },
      { imei: '867530012345603', branch: 'kochi', status: 'available' },
      { imei: '867530012345604', branch: 'kochi', status: 'available' },
      { imei: '867530012345605', branch: 'kochi', status: 'available' },
      { imei: '867530012345606', branch: 'trivandrum', status: 'available' },
      { imei: '867530012345607', branch: 'trivandrum', status: 'available' },
      { imei: '867530012345608', branch: 'trivandrum', status: 'available' },
      { imei: '867530012345609', branch: 'trivandrum', status: 'available' },
      { imei: '867530012345610', branch: 'thrissur', status: 'available' },
      { imei: '867530012345611', branch: 'thrissur', status: 'available' },
      { imei: '867530012345612', branch: 'thrissur', status: 'available' },
      { imei: '867530012345613', branch: 'webstore', status: 'available' },
      { imei: '867530012345614', branch: 'webstore', status: 'available' },
      { imei: '867530012345615', branch: 'webstore', status: 'available' },
      { imei: '867530012345616', branch: 'webstore', status: 'available' },
      { imei: '867530012345617', branch: 'webstore', status: 'available' },
      { imei: '867530012345618', branch: 'webstore', status: 'available' },
      { imei: '867530012345619', branch: 'webstore', status: 'available' },
    ],
  },

  // ── Vivo ────────────────────────────────────────────────────────────
  {
    sku: 'VIV-V30P-256-RED',
    name: 'Vivo V30 Pro',
    brand: 'Vivo',
    category: 'mobile_phones',
    gstKey: 'MOBILE_PHONES',
    hsnCode: HSN_CODES.MOBILE_PHONES,
    color: 'Peacock Red',
    storage: '256GB',
    costPrice: 32999,
    sellingPrice: 42999,
    stock: {
      kochi: 6,
      trivandrum: 5,
      thrissur: 4,
      webstore: 8,
    },
    imeis: [
      { imei: '862345678901001', branch: 'kochi', status: 'available' },
      { imei: '862345678901002', branch: 'kochi', status: 'available' },
      { imei: '862345678901003', branch: 'kochi', status: 'available' },
      { imei: '862345678901004', branch: 'kochi', status: 'available' },
      { imei: '862345678901005', branch: 'kochi', status: 'available' },
      { imei: '862345678901006', branch: 'kochi', status: 'available' },
      { imei: '862345678901007', branch: 'trivandrum', status: 'available' },
      { imei: '862345678901008', branch: 'trivandrum', status: 'available' },
      { imei: '862345678901009', branch: 'trivandrum', status: 'available' },
      { imei: '862345678901010', branch: 'trivandrum', status: 'available' },
      { imei: '862345678901011', branch: 'trivandrum', status: 'available' },
      { imei: '862345678901012', branch: 'thrissur', status: 'available' },
      { imei: '862345678901013', branch: 'thrissur', status: 'available' },
      { imei: '862345678901014', branch: 'thrissur', status: 'available' },
      { imei: '862345678901015', branch: 'thrissur', status: 'available' },
      { imei: '862345678901016', branch: 'webstore', status: 'available' },
      { imei: '862345678901017', branch: 'webstore', status: 'available' },
      { imei: '862345678901018', branch: 'webstore', status: 'available' },
      { imei: '862345678901019', branch: 'webstore', status: 'available' },
      { imei: '862345678901020', branch: 'webstore', status: 'available' },
      { imei: '862345678901021', branch: 'webstore', status: 'available' },
      { imei: '862345678901022', branch: 'webstore', status: 'available' },
      { imei: '862345678901023', branch: 'webstore', status: 'available' },
    ],
  },

  // ── iPhone ──────────────────────────────────────────────────────────
  {
    sku: 'APL-IP16P-256-NAT',
    name: 'Apple iPhone 16 Pro',
    brand: 'Apple',
    category: 'mobile_phones',
    gstKey: 'MOBILE_PHONES',
    hsnCode: HSN_CODES.MOBILE_PHONES,
    color: 'Natural Titanium',
    storage: '256GB',
    costPrice: 119900,
    sellingPrice: 143900,
    stock: {
      kochi: 3,
      trivandrum: 2,
      thrissur: 1,
      webstore: 5,
    },
    imeis: [
      { imei: '353456789012301', branch: 'kochi', status: 'available' },
      { imei: '353456789012302', branch: 'kochi', status: 'available' },
      { imei: '353456789012303', branch: 'kochi', status: 'available' },
      { imei: '353456789012304', branch: 'trivandrum', status: 'available' },
      { imei: '353456789012305', branch: 'trivandrum', status: 'available' },
      { imei: '353456789012306', branch: 'thrissur', status: 'available' },
      { imei: '353456789012307', branch: 'webstore', status: 'available' },
      { imei: '353456789012308', branch: 'webstore', status: 'available' },
      { imei: '353456789012309', branch: 'webstore', status: 'available' },
      { imei: '353456789012310', branch: 'webstore', status: 'available' },
      { imei: '353456789012311', branch: 'webstore', status: 'available' },
    ],
  },

  // ── Xiaomi ──────────────────────────────────────────────────────────
  {
    sku: 'MI-14-256-BLK',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'mobile_phones',
    gstKey: 'MOBILE_PHONES',
    hsnCode: HSN_CODES.MOBILE_PHONES,
    color: 'Black',
    storage: '256GB',
    costPrice: 54999,
    sellingPrice: 69999,
    stock: {
      kochi: 4,
      trivandrum: 3,
      thrissur: 3,
      webstore: 5,
    },
    imeis: [
      { imei: '869012345678001', branch: 'kochi', status: 'available' },
      { imei: '869012345678002', branch: 'kochi', status: 'available' },
      { imei: '869012345678003', branch: 'kochi', status: 'available' },
      { imei: '869012345678004', branch: 'kochi', status: 'available' },
      { imei: '869012345678005', branch: 'trivandrum', status: 'available' },
      { imei: '869012345678006', branch: 'trivandrum', status: 'available' },
      { imei: '869012345678007', branch: 'trivandrum', status: 'available' },
      { imei: '869012345678008', branch: 'thrissur', status: 'available' },
      { imei: '869012345678009', branch: 'thrissur', status: 'available' },
      { imei: '869012345678010', branch: 'thrissur', status: 'available' },
      { imei: '869012345678011', branch: 'webstore', status: 'available' },
      { imei: '869012345678012', branch: 'webstore', status: 'available' },
      { imei: '869012345678013', branch: 'webstore', status: 'available' },
      { imei: '869012345678014', branch: 'webstore', status: 'available' },
      { imei: '869012345678015', branch: 'webstore', status: 'available' },
    ],
  },

  // ── Feature Phone ───────────────────────────────────────────────────
  {
    sku: 'NOK-105-DS-BLK',
    name: 'Nokia 105 Dual SIM',
    brand: 'Nokia',
    category: 'feature_phones',
    gstKey: 'FEATURE_PHONES',
    hsnCode: HSN_CODES.FEATURE_PHONES,
    color: 'Charcoal',
    storage: 'N/A',
    costPrice: 1199,
    sellingPrice: 1649,
    stock: {
      kochi: 15,
      trivandrum: 12,
      thrissur: 10,
      webstore: 0,
    },
    imeis: [
      { imei: '359876543210001', branch: 'kochi', status: 'available' },
      { imei: '359876543210002', branch: 'kochi', status: 'available' },
      { imei: '359876543210003', branch: 'trivandrum', status: 'available' },
      { imei: '359876543210004', branch: 'trivandrum', status: 'available' },
      { imei: '359876543210005', branch: 'thrissur', status: 'available' },
    ],
  },

  // ── Smart Watch ─────────────────────────────────────────────────────
  {
    sku: 'SAM-GW6-44-SLV',
    name: 'Samsung Galaxy Watch 6 (44mm)',
    brand: 'Samsung',
    category: 'smartwatches',
    gstKey: 'SMARTWATCHES',
    hsnCode: HSN_CODES.SMARTWATCHES,
    color: 'Silver',
    storage: 'N/A',
    costPrice: 24999,
    sellingPrice: 32999,
    stock: {
      kochi: 3,
      trivandrum: 2,
      thrissur: 2,
      webstore: 4,
    },
    imeis: [
      { imei: '356789012345601', branch: 'kochi', status: 'available' },
      { imei: '356789012345602', branch: 'kochi', status: 'available' },
      { imei: '356789012345603', branch: 'kochi', status: 'available' },
      { imei: '356789012345604', branch: 'trivandrum', status: 'available' },
      { imei: '356789012345605', branch: 'trivandrum', status: 'available' },
      { imei: '356789012345606', branch: 'thrissur', status: 'available' },
      { imei: '356789012345607', branch: 'thrissur', status: 'available' },
      { imei: '356789012345608', branch: 'webstore', status: 'available' },
      { imei: '356789012345609', branch: 'webstore', status: 'available' },
      { imei: '356789012345610', branch: 'webstore', status: 'available' },
      { imei: '356789012345611', branch: 'webstore', status: 'available' },
    ],
  },

  // ── Tablet ──────────────────────────────────────────────────────────
  {
    sku: 'SAM-TABS9-128-GRY',
    name: 'Samsung Galaxy Tab S9',
    brand: 'Samsung',
    category: 'tablets',
    gstKey: 'TABLETS',
    hsnCode: HSN_CODES.TABLETS,
    color: 'Graphite',
    storage: '128GB',
    costPrice: 64999,
    sellingPrice: 82999,
    stock: {
      kochi: 2,
      trivandrum: 2,
      thrissur: 1,
      webstore: 3,
    },
    imeis: [
      { imei: '358901234567001', branch: 'kochi', status: 'available' },
      { imei: '358901234567002', branch: 'kochi', status: 'available' },
      { imei: '358901234567003', branch: 'trivandrum', status: 'available' },
      { imei: '358901234567004', branch: 'trivandrum', status: 'available' },
      { imei: '358901234567005', branch: 'thrissur', status: 'available' },
      { imei: '358901234567006', branch: 'webstore', status: 'available' },
      { imei: '358901234567007', branch: 'webstore', status: 'available' },
      { imei: '358901234567008', branch: 'webstore', status: 'available' },
    ],
  },
];

/**
 * Find a product by IMEI — used by POS IMEI scanner.
 * Returns { product, imeiRecord } or null.
 */
export function findByIMEI(imei) {
  for (const product of inventory) {
    const imeiRecord = product.imeis.find((i) => i.imei === imei);
    if (imeiRecord) {
      return { product, imeiRecord };
    }
  }
  return null;
}

/**
 * Find a product by SKU.
 */
export function findBySKU(sku) {
  return inventory.find((p) => p.sku === sku) || null;
}

/**
 * Get total stock across all branches for a product.
 */
export function getTotalStock(product) {
  return Object.values(product.stock).reduce((sum, count) => sum + count, 0);
}

/**
 * Check if an IMEI already exists in inventory (duplicate validation).
 * Used by Stock Operations §4.2: "duplicate IMEI validation check."
 */
export function isIMEIDuplicate(imei) {
  return inventory.some((p) => p.imeis.some((i) => i.imei === imei));
}
