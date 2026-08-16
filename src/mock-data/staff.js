/**
 * SGHASH Mock Data — Staff Directory
 * 
 * Architecture Spec §3.4: "<StaffDirectoryTable>: A complete organizational chart
 * listing all employees, assigned roles, and current system access status."
 * 
 * Also supports <CredentialManagerModal>: "Force Password Reset" or "Suspend Account Session".
 */

import { ROLES, ROLE_LABELS } from './users';

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
