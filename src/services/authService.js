/**
 * SGHASH Service Layer — Authentication
 * 
 * All functions are async and return { success, data, error } responses.
 * The function bodies simulate API calls — swap internals for real fetch()
 * when connecting to a backend.
 */

import { findUserByIdentifier } from '../mock-data/users';

/** Simulated network delay */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login with identifier (username, email, or employee ID) and password.
 * Returns a simulated JWT token on success.
 */
export async function login(identifier, password) {
  await delay(800 + Math.random() * 400);

  const user = findUserByIdentifier(identifier);

  if (!user) {
    return {
      success: false,
      data: null,
      error: 'No account found with that identifier.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      data: null,
      error: 'Incorrect password. Please try again.',
    };
  }

  if (user.status === 'suspended') {
    return {
      success: false,
      data: null,
      error: 'This account has been suspended. Contact your administrator.',
    };
  }

  // Simulate JWT token
  const token = `sghash_${btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))}`;

  return {
    success: true,
    data: {
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        branch: user.branch,
        designation: user.designation,
        employeeId: user.employeeId,
      },
      token,
    },
    error: null,
  };
}

/**
 * Request OTP for password reset.
 * Architecture Spec §2.2 State 1: "Request. <EmailInput> accepts the address."
 */
export async function requestPasswordResetOTP(email) {
  await delay(1000 + Math.random() * 500);

  const user = findUserByIdentifier(email);

  if (!user) {
    return {
      success: false,
      data: null,
      error: 'No account is registered with this email address.',
    };
  }

  return {
    success: true,
    data: { message: 'OTP has been sent to your registered email address.' },
    error: null,
  };
}

/**
 * Verify OTP.
 * Architecture Spec §2.2 State 2: "Verify. <AnimatedOtpBlock> reveals
 * a 6-digit OTP input array."
 * 
 * Prototype: OTP is always 123456.
 */
export async function verifyOTP(email, otp) {
  await delay(600 + Math.random() * 400);

  if (otp === '123456') {
    return {
      success: true,
      data: { message: 'OTP verified successfully.', resetToken: 'rst_' + Date.now() },
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    error: 'Invalid OTP. Please check and try again.',
  };
}

/**
 * Reset password.
 * Architecture Spec §2.2 State 3: "Upon 200 OK API response, the previous
 * fields slide out. <AnimatedPasswordSetup> slides in."
 */
export async function resetPassword(email, resetToken, newPassword) {
  await delay(800 + Math.random() * 400);

  if (!resetToken) {
    return {
      success: false,
      data: null,
      error: 'Invalid reset session. Please start over.',
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      data: null,
      error: 'Password must be at least 6 characters.',
    };
  }

  return {
    success: true,
    data: { message: 'Password has been reset successfully. You can now log in.' },
    error: null,
  };
}

/**
 * Validate the stored session token.
 */
export async function validateToken(token) {
  await delay(300);

  if (!token || !token.startsWith('sghash_')) {
    return { success: false, data: null, error: 'Invalid token.' };
  }

  try {
    const payload = JSON.parse(atob(token.replace('sghash_', '')));
    if (payload.exp < Date.now()) {
      return { success: false, data: null, error: 'Token expired.' };
    }

    const user = findUserByIdentifier(payload.id);
    if (!user) {
      return { success: false, data: null, error: 'User not found.' };
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          branch: user.branch,
          designation: user.designation,
          employeeId: user.employeeId,
        },
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Malformed token.' };
  }
}

/**
 * Logout — clear session.
 */
export async function logout() {
  await delay(200);
  return { success: true, data: null, error: null };
}
