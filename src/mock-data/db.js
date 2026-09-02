/**
 * SGHASH - Single Source-of-Truth Mock Database
 *
 * All hardcoded placeholder data lives here.
 * Backend engineer: replace the relevant service in src/services/
 * with a real fetch() / axios call. The services/ layer is the
 * ONLY integration surface - do NOT edit component files directly.
 *
 * API replacement guide (per section below):
 *   Sec 1  Users      -> POST /api/auth/login
 *   Sec 2  Branches   -> GET  /api/branches
 *   Sec 3  GST/Tax    -> GET  /api/config/gst-rates
 *   Sec 4  Inventory  -> GET  /api/inventory?branch=:b
 *   Sec 5  Sales      -> GET  /api/analytics/metrics?branch=:b&period=:p
 *   Sec 6  Staff      -> GET  /api/staff?branch=:b
 *   Sec 7  Transfers  -> GET  /api/transfers?status=active
 */

// =============================================================================
// SECTION 1: USERS & AUTHENTICATION
// TODO (backend): Replace with POST /api/auth/login -> { token, user }
// =============================================================================

export const ROLES = {
  OWNER: 'owner',
  INVENTORY_MANAGER: 'inventory_manager',
  BILLING_CLERK: 'billing_clerk',
};

export const ROLE_LABELS = {
  [ROLES.OWNER]: 'Owner / Super Admin',
  [ROLES.INVENTORY_MANAGER]: 'Inventory Manager',
  [ROLES.BILLING_CLERK]: 'Billing Clerk',
};

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.OWNER]: '/dashboard',
  [ROLES.INVENTORY_MANAGER]: '/inventory',
  [ROLES.BILLING_CLERK]: '/pos',
};

/**
 * Role → permitted route prefixes mapping for ProtectedRoute.
 */
export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ['/dashboard', '/inventory', '/pos'],
  [ROLES.INVENTORY_MANAGER]: ['/inventory'],
  [ROLES.BILLING_CLERK]: ['/pos'],
};

export const users = [
  {
    id: 'usr_001',
    username: 'owner@sghash.in',
    password: 'owner123',
    displayName: 'Rajesh Menon',
    email: 'owner@sghash.in',
    employeeId: 'EMP-001',
    role: ROLES.OWNER,
    branch: 'all',
    avatar: null,
    phone: '+91 98470 12345',
    designation: 'Managing Director',
    status: 'active',
    lastLogin: '2026-08-15T18:32:00+05:30',
  },
  {
    id: 'usr_002',
    username: 'inv.tvm@sghash.in',
    password: 'stock123',
    displayName: 'Anil Kumar S',
    email: 'inv.tvm@sghash.in',
    employeeId: 'EMP-007',
    role: ROLES.INVENTORY_MANAGER,
    branch: 'trivandrum',
    avatar: null,
    phone: '+91 94960 67890',
    designation: 'Inventory Manager',
    status: 'active',
    lastLogin: '2026-08-15T09:15:00+05:30',
  },
  {
    id: 'usr_003',
    username: 'pos.kochi@sghash.in',
    password: 'bill123',
    displayName: 'Priya Nair',
    email: 'pos.kochi@sghash.in',
    employeeId: 'EMP-012',
    role: ROLES.BILLING_CLERK,
    branch: 'kochi',
    avatar: null,
    phone: '+91 70126 54321',
    designation: 'Senior Billing Clerk',
    status: 'active',
    lastLogin: '2026-08-15T14:45:00+05:30',
  },
];

/**
 * Lookup a user by any identifier (username, email, or employee ID).
 * Matches the Architecture Spec §2.1: "<IdentifierInput>: Auto-focused field
 * accepting Username, Email, or Employee ID."
 */
export function findUserByIdentifier(identifier) {
  const lower = identifier.toLowerCase().trim();
  return users.find(
    (u) =>
      u.username.toLowerCase() === lower ||
      u.email.toLowerCase() === lower ||
      u.employeeId.toLowerCase() === lower
  );
}


// =============================================================================
// SECTION 2: BRANCHES & STORE CONFIGURATION
// TODO (backend): Replace with GET /api/branches
// =============================================================================

// (Branch data is in SECTION 4 - INVENTORY file, kept there for co-location)

// =============================================================================
// SECTION 3: GST & TAX CONFIGURATION
// TODO (backend): Replace with GET /api/config/gst-rates
// =============================================================================

// (GST_RATES, HSN_CODES, PRODUCT_CATEGORIES are in SECTION 4 below)

// =============================================================================
// SECTION 4: BRANCHES + GST CONFIG + INVENTORY (SKUs, Stock, IMEIs)
// TODO (backend): GET /api/inventory?branch=:branch | GET /api/inventory/imei/:imei
// =============================================================================

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


// =============================================================================
// SECTION 5: SALES & ANALYTICS
// TODO (backend): GET /api/analytics/metrics?branch=:b&period=:p
//                 GET /api/transactions?branch=:b&limit=:n
// =============================================================================

export const salesMetrics = {
  daily: {
    kochi: {
      totalRevenue: 485200,
      billVolume: 32,
      avgOrderValue: 15163,
      totalDiscounts: 24800,
      revenueGrowth: 8.5,
      tenderSplit: { cash: 145600, upi: 218340, card: 121260 },
    },
    trivandrum: {
      totalRevenue: 372600,
      billVolume: 26,
      avgOrderValue: 14331,
      totalDiscounts: 18200,
      revenueGrowth: 5.2,
      tenderSplit: { cash: 111780, upi: 186300, card: 74520 },
    },
    thrissur: {
      totalRevenue: 298400,
      billVolume: 21,
      avgOrderValue: 14210,
      totalDiscounts: 14500,
      revenueGrowth: -2.1,
      tenderSplit: { cash: 119360, upi: 134280, card: 44760 },
    },
    webstore: {
      totalRevenue: 196800,
      billVolume: 14,
      avgOrderValue: 14057,
      totalDiscounts: 12400,
      revenueGrowth: 22.8,
      tenderSplit: { cash: 0, upi: 137760, card: 59040 },
    },
  },
  monthly: {
    kochi: {
      totalRevenue: 12450000,
      billVolume: 847,
      avgOrderValue: 14698,
      totalDiscounts: 624000,
      revenueGrowth: 12.5,
      tenderSplit: { cash: 3735000, upi: 5602500, card: 3112500 },
    },
    trivandrum: {
      totalRevenue: 9870000,
      billVolume: 692,
      avgOrderValue: 14262,
      totalDiscounts: 498000,
      revenueGrowth: 8.3,
      tenderSplit: { cash: 2961000, upi: 4935000, card: 1974000 },
    },
    thrissur: {
      totalRevenue: 7640000,
      billVolume: 534,
      avgOrderValue: 14307,
      totalDiscounts: 382000,
      revenueGrowth: 3.7,
      tenderSplit: { cash: 3056000, upi: 3438000, card: 1146000 },
    },
    webstore: {
      totalRevenue: 5280000,
      billVolume: 376,
      avgOrderValue: 14043,
      totalDiscounts: 316800,
      revenueGrowth: 34.2,
      tenderSplit: { cash: 0, upi: 3696000, card: 1584000 },
    },
  },
  yearly: {
    kochi: {
      totalRevenue: 148500000,
      billVolume: 10124,
      avgOrderValue: 14670,
      totalDiscounts: 7425000,
      revenueGrowth: 18.4,
      tenderSplit: { cash: 44550000, upi: 66825000, card: 37125000 },
    },
    trivandrum: {
      totalRevenue: 118200000,
      billVolume: 8284,
      avgOrderValue: 14271,
      totalDiscounts: 5910000,
      revenueGrowth: 14.1,
      tenderSplit: { cash: 35460000, upi: 59100000, card: 23640000 },
    },
    thrissur: {
      totalRevenue: 91500000,
      billVolume: 6405,
      avgOrderValue: 14285,
      totalDiscounts: 4575000,
      revenueGrowth: 9.8,
      tenderSplit: { cash: 36600000, upi: 41175000, card: 13725000 },
    },
    webstore: {
      totalRevenue: 63200000,
      billVolume: 4507,
      avgOrderValue: 14023,
      totalDiscounts: 3792000,
      revenueGrowth: 52.3,
      tenderSplit: { cash: 0, upi: 44240000, card: 18960000 },
    },
  },
};

/**
 * Get consolidated metrics across all branches for a given period.
 */
export function getConsolidatedMetrics(period = 'monthly') {
  const periodData = salesMetrics[period];
  if (!periodData) return null;

  const branches = Object.values(periodData);
  const consolidated = {
    totalRevenue: branches.reduce((s, b) => s + b.totalRevenue, 0),
    billVolume: branches.reduce((s, b) => s + b.billVolume, 0),
    totalDiscounts: branches.reduce((s, b) => s + b.totalDiscounts, 0),
    tenderSplit: {
      cash: branches.reduce((s, b) => s + b.tenderSplit.cash, 0),
      upi: branches.reduce((s, b) => s + b.tenderSplit.upi, 0),
      card: branches.reduce((s, b) => s + b.tenderSplit.card, 0),
    },
  };
  consolidated.avgOrderValue = Math.round(
    consolidated.totalRevenue / consolidated.billVolume
  );
  consolidated.revenueGrowth = +(
    branches.reduce((s, b) => s + b.revenueGrowth, 0) / branches.length
  ).toFixed(1);

  return consolidated;
}

/**
 * Get metrics for a specific branch and period.
 */
export function getBranchMetrics(branch, period = 'monthly') {
  if (branch === 'all') return getConsolidatedMetrics(period);
  return salesMetrics[period]?.[branch] || null;
}

/**
 * Get multi-branch comparison data for charts.
 * Returns an array of { branch, revenue, bills } for each physical branch + webstore.
 */
export function getMultiBranchComparison(period = 'monthly') {
  const periodData = salesMetrics[period];
  if (!periodData) return [];

  return Object.entries(periodData).map(([branchKey, data]) => ({
    branch: branchKey,
    revenue: data.totalRevenue,
    bills: data.billVolume,
    aov: data.avgOrderValue,
  }));
}

/**
 * Recent transactions for the activity feed.
 */
export const recentTransactions = [
  {
    id: 'TXN-2608-001',
    date: '2026-08-15T18:45:00+05:30',
    branch: 'kochi',
    items: ['Samsung Galaxy S24 Ultra'],
    amount: 134999,
    paymentMethod: 'card',
    customerName: 'Deepak R',
  },
  {
    id: 'TXN-2608-002',
    date: '2026-08-15T17:30:00+05:30',
    branch: 'trivandrum',
    items: ['Vivo V30 Pro', 'Screen Protector'],
    amount: 43648,
    paymentMethod: 'upi',
    customerName: 'Meera S',
  },
  {
    id: 'TXN-2608-003',
    date: '2026-08-15T16:15:00+05:30',
    branch: 'kochi',
    items: ['Nokia 105 Dual SIM'],
    amount: 1649,
    paymentMethod: 'cash',
    customerName: 'Walk-in',
  },
  {
    id: 'TXN-2608-004',
    date: '2026-08-15T15:00:00+05:30',
    branch: 'thrissur',
    items: ['OnePlus 12'],
    amount: 69999,
    paymentMethod: 'upi',
    customerName: 'Vishnu K',
  },
  {
    id: 'TXN-2608-005',
    date: '2026-08-15T14:20:00+05:30',
    branch: 'webstore',
    items: ['Samsung Galaxy A55 5G'],
    amount: 39999,
    paymentMethod: 'card',
    customerName: 'Arjun M',
  },
];


// =============================================================================
// SECTION 6: STAFF DIRECTORY
// TODO (backend): GET /api/staff?branch=:branch
//                 PUT /api/staff/:id/force-reset-password
//                 PUT /api/staff/:id/suspend
// =============================================================================

export const STAFF_STATUSES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
  PASSWORD_RESET_PENDING: 'password_reset_pending',
};

export const STAFF_STATUS_LABELS = {
  [STAFF_STATUSES.ACTIVE]: 'Active',
  [STAFF_STATUSES.SUSPENDED]: 'Suspended',
  [STAFF_STATUSES.INACTIVE]: 'Inactive',
  [STAFF_STATUSES.PASSWORD_RESET_PENDING]: 'Password Reset Pending',
};

export const staff = [
  {
    id: 'EMP-001',
    name: 'Rajesh Menon',
    email: 'owner@sghash.in',
    phone: '+91 98470 12345',
    role: ROLES.OWNER,
    roleLabel: ROLE_LABELS[ROLES.OWNER],
    branch: 'all',
    designation: 'Managing Director',
    joinDate: '2018-03-15',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T18:32:00+05:30',
  },
  {
    id: 'EMP-002',
    name: 'Latha Krishnan',
    email: 'latha.k@sghash.in',
    phone: '+91 94470 23456',
    role: ROLES.OWNER,
    roleLabel: ROLE_LABELS[ROLES.OWNER],
    branch: 'all',
    designation: 'Operations Director',
    joinDate: '2018-06-01',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T16:10:00+05:30',
  },
  {
    id: 'EMP-003',
    name: 'Suresh Pillai',
    email: 'suresh.p@sghash.in',
    phone: '+91 81290 34567',
    role: ROLES.INVENTORY_MANAGER,
    roleLabel: ROLE_LABELS[ROLES.INVENTORY_MANAGER],
    branch: 'kochi',
    designation: 'Head — Inventory (Kochi)',
    joinDate: '2019-01-10',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T10:22:00+05:30',
  },
  {
    id: 'EMP-004',
    name: 'Sreeja Thomas',
    email: 'sreeja.t@sghash.in',
    phone: '+91 70256 45678',
    role: ROLES.BILLING_CLERK,
    roleLabel: ROLE_LABELS[ROLES.BILLING_CLERK],
    branch: 'kochi',
    designation: 'Billing Clerk',
    joinDate: '2021-04-20',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T14:55:00+05:30',
  },
  {
    id: 'EMP-005',
    name: 'Manoj Varma',
    email: 'manoj.v@sghash.in',
    phone: '+91 94960 56789',
    role: ROLES.BILLING_CLERK,
    roleLabel: ROLE_LABELS[ROLES.BILLING_CLERK],
    branch: 'kochi',
    designation: 'Senior Billing Clerk',
    joinDate: '2020-07-15',
    status: STAFF_STATUSES.PASSWORD_RESET_PENDING,
    lastLogin: '2026-08-13T09:30:00+05:30',
  },
  {
    id: 'EMP-006',
    name: 'Divya Rajan',
    email: 'divya.r@sghash.in',
    phone: '+91 81290 67890',
    role: ROLES.INVENTORY_MANAGER,
    roleLabel: ROLE_LABELS[ROLES.INVENTORY_MANAGER],
    branch: 'thrissur',
    designation: 'Inventory Manager (Thrissur)',
    joinDate: '2020-02-28',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T11:45:00+05:30',
  },
  {
    id: 'EMP-007',
    name: 'Anil Kumar S',
    email: 'inv.tvm@sghash.in',
    phone: '+91 94960 67890',
    role: ROLES.INVENTORY_MANAGER,
    roleLabel: ROLE_LABELS[ROLES.INVENTORY_MANAGER],
    branch: 'trivandrum',
    designation: 'Inventory Manager (Trivandrum)',
    joinDate: '2019-09-05',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T09:15:00+05:30',
  },
  {
    id: 'EMP-008',
    name: 'Reshma Nambiar',
    email: 'reshma.n@sghash.in',
    phone: '+91 70126 78901',
    role: ROLES.BILLING_CLERK,
    roleLabel: ROLE_LABELS[ROLES.BILLING_CLERK],
    branch: 'trivandrum',
    designation: 'Billing Clerk',
    joinDate: '2022-01-10',
    status: STAFF_STATUSES.SUSPENDED,
    lastLogin: '2026-08-10T08:30:00+05:30',
  },
  {
    id: 'EMP-009',
    name: 'Vinod George',
    email: 'vinod.g@sghash.in',
    phone: '+91 98470 89012',
    role: ROLES.BILLING_CLERK,
    roleLabel: ROLE_LABELS[ROLES.BILLING_CLERK],
    branch: 'thrissur',
    designation: 'Billing Clerk',
    joinDate: '2021-11-15',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T13:20:00+05:30',
  },
  {
    id: 'EMP-010',
    name: 'Akhil Mohan',
    email: 'akhil.m@sghash.in',
    phone: '+91 81290 90123',
    role: ROLES.BILLING_CLERK,
    roleLabel: ROLE_LABELS[ROLES.BILLING_CLERK],
    branch: 'thrissur',
    designation: 'Junior Billing Clerk',
    joinDate: '2023-06-01',
    status: STAFF_STATUSES.INACTIVE,
    lastLogin: '2026-07-28T17:00:00+05:30',
  },
  {
    id: 'EMP-011',
    name: 'Fathima Beevi',
    email: 'fathima.b@sghash.in',
    phone: '+91 70256 01234',
    role: ROLES.INVENTORY_MANAGER,
    roleLabel: ROLE_LABELS[ROLES.INVENTORY_MANAGER],
    branch: 'webstore',
    designation: 'Webstore Operations Manager',
    joinDate: '2022-08-20',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T12:00:00+05:30',
  },
  {
    id: 'EMP-012',
    name: 'Priya Nair',
    email: 'pos.kochi@sghash.in',
    phone: '+91 70126 54321',
    role: ROLES.BILLING_CLERK,
    roleLabel: ROLE_LABELS[ROLES.BILLING_CLERK],
    branch: 'kochi',
    designation: 'Senior Billing Clerk',
    joinDate: '2020-03-01',
    status: STAFF_STATUSES.ACTIVE,
    lastLogin: '2026-08-15T14:45:00+05:30',
  },
];

/**
 * Get staff filtered by branch.
 */
export function getStaffByBranch(branch) {
  if (branch === 'all') return staff;
  return staff.filter((s) => s.branch === branch || s.branch === 'all');
}

/**
 * Get staff filtered by role.
 */
export function getStaffByRole(role) {
  return staff.filter((s) => s.role === role);
}

/**
 * Get staff counts by status for IAM overview.
 */
export function getStaffStatusCounts() {
  const counts = {};
  for (const status of Object.values(STAFF_STATUSES)) {
    counts[status] = staff.filter((s) => s.status === status).length;
  }
  return counts;
}


// =============================================================================
// SECTION 7: INTER-STORE TRANSFERS
// TODO (backend): GET /api/transfers?status=active
//                 GET /api/transfers?destination=:branch&status=pending_verification
//                 POST /api/transfers/:id/force-approve
// =============================================================================

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
