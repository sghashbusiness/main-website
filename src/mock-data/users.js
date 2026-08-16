/**
 * SGHASH Mock Data — Users
 * 
 * Pre-seeded test accounts per the implementation plan.
 * Each user has a role that determines their module access and default route.
 * Passwords are stored as plain text for the prototype — a real backend
 * would use bcrypt hashes.
 */

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
