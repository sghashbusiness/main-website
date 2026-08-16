/**
 * SGHASH — ProtectedRoute
 * 
 * RBAC route guard that checks AuthContext role against permitted routes.
 * Redirects unauthenticated users to /login and unauthorized users to
 * their role's default route.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_PERMISSIONS, ROLE_DEFAULT_ROUTES } from '../../mock-data/users';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Show nothing while checking session
  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="anim-spinner" style={{
          width: 32,
          height: 32,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
        }} />
      </div>
    );
  }

  // Not authenticated → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to user's default route instead of showing 403
    const defaultRoute = ROLE_DEFAULT_ROUTES[role] || '/login';
    return <Navigate to={defaultRoute} replace />;
  }

  // If no specific roles listed, check if the current path is permitted for this role
  if (!allowedRoles) {
    const permissions = ROLE_PERMISSIONS[role] || [];
    const isPermitted = permissions.some((prefix) =>
      location.pathname.startsWith(prefix)
    );

    if (!isPermitted) {
      const defaultRoute = ROLE_DEFAULT_ROUTES[role] || '/login';
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return children;
}
