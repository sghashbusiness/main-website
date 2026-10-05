/**
 * SGHASH — Sidebar Navigation
 * Auto-collapses to icon-only on nav item click, expands on hover.
 * Glassmorphic frosted pill buttons.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../mock-data/db';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const getNavItems = (role) => {
  const items = [];

  if (role === ROLES.OWNER) {
    items.push(
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/inventory', label: 'Stock Ops', icon: Package },
      { path: '/pos', label: 'POS Terminal', icon: ShoppingCart },
    );
  } else if (role === ROLES.INVENTORY_MANAGER) {
    items.push(
      { path: '/inventory', label: 'Stock Ops', icon: Package },
    );
  } else if (role === ROLES.BILLING_CLERK) {
    items.push(
      { path: '/pos', label: 'POS Terminal', icon: ShoppingCart },
    );
  }

  return items;
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  // collapsed = icon-only mode; hovered = temporarily expanded
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navItems = getNavItems(role);
  const navigate = useNavigate();

  const isExpanded = !collapsed || hovered;

  const handleNavClick = (path) => {
    setCollapsed(true);  // auto-collapse on nav click
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={`sidebar ${collapsed && !hovered ? 'sidebar--collapsed' : ''}`}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Brand ─────────────────────────────────────────────────── */}
      <div className="sidebar__brand">
        <img src="/sghash-green-logo.png" alt="SGHASH" className="sidebar__logo" />
        {isExpanded && (
          <div className="sidebar__brand-text">
            <img src="/sghash-logo-text-new.png" alt="SGHASH ONE" className="sidebar__logo-text" />
          </div>
        )}
      </div>

      {/* ── Section Label ─────────────────────────────────────────── */}
      {isExpanded && (
        <div className="sidebar__section-label">NAVIGATION</div>
      )}

      {/* ── Nav Items ─────────────────────────────────────────────── */}
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
            }
            onClick={() => handleNavClick(item.path)}
            title={!isExpanded ? item.label : undefined}
          >
            <item.icon size={20} className="sidebar__nav-icon" />
            {isExpanded && (
              <span className="sidebar__nav-label">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom / Logout ────────────────────────────────────────── */}
      <div className="sidebar__bottom">
        <button
          className="sidebar__logout-btn"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={20} />
          {isExpanded && <span className="sidebar__logout-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
