/**
 * SGHASH Service Layer — Staff Management
 * 
 * Staff directory operations and credential management.
 * All functions are async for backend-ready architecture.
 */

import { staff, getStaffByBranch, getStaffByRole, getStaffStatusCounts, STAFF_STATUSES } from '../mock-data/staff';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get staff directory listing.
 * Architecture Spec §3.4: "<StaffDirectoryTable>: A complete organizational
 * chart listing all employees, assigned roles, and current system access status."
 */
export async function getStaffDirectory(branch = 'all') {
  await delay(400 + Math.random() * 300);

  const filtered = getStaffByBranch(branch);

  return {
    success: true,
    data: filtered,
    error: null,
  };
}

/**
 * Get staff by role.
 */
export async function getStaffByRoleFilter(role) {
  await delay(300 + Math.random() * 200);

  const filtered = getStaffByRole(role);
  return { success: true, data: filtered, error: null };
}

/**
 * Get staff status summary counts.
 */
export async function getStatusSummary() {
  await delay(200 + Math.random() * 100);

  return {
    success: true,
    data: getStaffStatusCounts(),
    error: null,
  };
}

/**
 * Force password reset for an employee.
 * Architecture Spec §3.4: "<CredentialManagerModal>: Owner-level security
 * actions — 'Force Password Reset'."
 */
export async function forcePasswordReset(employeeId) {
  await delay(800 + Math.random() * 400);

  const employee = staff.find((s) => s.id === employeeId);
  if (!employee) {
    return {
      success: false,
      data: null,
      error: 'Employee not found.',
    };
  }

  // Simulate status update
  employee.status = STAFF_STATUSES.PASSWORD_RESET_PENDING;

  return {
    success: true,
    data: {
      message: `Password reset forced for ${employee.name}. They will be prompted on next login.`,
      employee: { id: employee.id, name: employee.name, status: employee.status },
    },
    error: null,
  };
}

/**
 * Suspend an employee's account session.
 * Architecture Spec §3.4: "'Suspend Account Session' instantly."
 */
export async function suspendSession(employeeId) {
  await delay(600 + Math.random() * 300);

  const employee = staff.find((s) => s.id === employeeId);
  if (!employee) {
    return {
      success: false,
      data: null,
      error: 'Employee not found.',
    };
  }

  employee.status = STAFF_STATUSES.SUSPENDED;

  return {
    success: true,
    data: {
      message: `Account session suspended for ${employee.name}. All active sessions have been terminated.`,
      employee: { id: employee.id, name: employee.name, status: employee.status },
    },
    error: null,
  };
}

/**
 * Reactivate a suspended employee account.
 */
export async function reactivateAccount(employeeId) {
  await delay(600 + Math.random() * 300);

  const employee = staff.find((s) => s.id === employeeId);
  if (!employee) {
    return {
      success: false,
      data: null,
      error: 'Employee not found.',
    };
  }

  employee.status = STAFF_STATUSES.ACTIVE;

  return {
    success: true,
    data: {
      message: `Account reactivated for ${employee.name}.`,
      employee: { id: employee.id, name: employee.name, status: employee.status },
    },
    error: null,
  };
}
