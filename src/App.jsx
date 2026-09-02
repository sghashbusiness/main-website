/**
 * SGHASH — Root Application Component
 * 
 * Routes and layout structure.
 * Login page renders full-screen (no sidebar).
 * All module routes render inside AppShell (sidebar + header + content).
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import { ROLES, ROLE_DEFAULT_ROUTES } from './mock-data/db';

import LoginPage from './pages/Login/LoginPage';

/* ── Placeholder pages (replaced in Phases 6-8) ──────────────────────*/
function PlaceholderPage({ title, description }) {
  return (
    <div className="placeholder-page">
      <img src="/sghash-logo.png" alt="SGHASH" className="placeholder-page__logo" />
      <h2 className="text-section-header">{title}</h2>
      <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
        {description || 'Module implementation in progress'}
      </p>
    </div>
  );
}

import DashboardPage from './pages/Dashboard/DashboardPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import POSPage from './pages/POS/POSPage';

function App() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '100vh', background: 'var(--color-canvas)' }}>
        <div className="anim-spinner" style={{
          width: 40,
          height: 40,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
        }} />
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public: Login (full-screen, no sidebar) ─────────────── */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={ROLE_DEFAULT_ROUTES[role] || '/dashboard'} replace />
            : <LoginPage />
        }
      />

      {/* ── Protected routes inside AppShell ─────────────────────── */}
      <Route element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        {/* Executive Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/*" element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Stock Operations */}
        <Route path="/inventory" element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.INVENTORY_MANAGER]}>
            <InventoryPage />
          </ProtectedRoute>
        } />
        <Route path="/inventory/*" element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.INVENTORY_MANAGER]}>
            <InventoryPage />
          </ProtectedRoute>
        } />

        {/* POS Terminal */}
        <Route path="/pos" element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.BILLING_CLERK]}>
            <POSPage />
          </ProtectedRoute>
        } />
        <Route path="/pos/*" element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.BILLING_CLERK]}>
            <POSPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* ── Catch-all redirect ──────────────────────────────────── */}
      <Route
        path="*"
        element={
          isAuthenticated
            ? <Navigate to={ROLE_DEFAULT_ROUTES[role] || '/dashboard'} replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
