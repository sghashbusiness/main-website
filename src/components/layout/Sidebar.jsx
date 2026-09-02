/**
 * SGHASH — Sidebar Navigation
 * 
 * Persistent left-hand sidebar per Prompt Spec §1.2:
 * "Dark theme (deep green/almost black) for the sidebar background.
 *  Navigation items should use rounded pill shapes, and the active state
 *  must feature a soft, light green glowing background with dark text.
 *  Include a search bar with a shortcut hint (e.g., ⌘+F) and a user
 *  profile block at the bottom."
 */

import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS } from '../../mock-data/db';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Search,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

/**
 * Navigation items per role.
 * Owner sees all modules; other roles see only their module.
 */
const getNavItems = (role) => {
  const items = [];

  if (role === ROLES.OWNER) {
    items.push(
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
      { path: '/inventory', label: 'Stock Ops', icon: Package, badge: null },
      { path: '/pos', label: 'POS Terminal', icon: ShoppingCart, badge: null },
    );
  } else if (role === ROLES.INVENTORY_MANAGER) {
    items.push(
      { path: '/inventory', label: 'Stock Ops', icon: Package, badge: null },
    );
  } else if (role === ROLES.BILLING_CLERK) {
    items.push(
      { path: '/pos', label: 'POS Terminal', icon: ShoppingCart, badge: null },
    );
  }

  return items;
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navItems = getNavItems(role);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* ── Brand Header ──────────────────────────────────────────── */}
      <div className="sidebar__brand">
        <img src="/sghash-green-logo.png" alt="SGHASH Icon" className="sidebar__logo" />
        {!collapsed && (
          <div className="sidebar__brand-text">
            <img src="/sghash-logo-text-new.png" alt="SGHASH ONE" className="sidebar__logo-text" />
          </div>
        )}
        <button
          className="sidebar__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>



      {/* ── Navigation Section Label ──────────────────────────────── */}
      {!collapsed && (
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
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="sidebar__nav-icon" />
            {!collapsed && (
              <>
                <span className="sidebar__nav-label">{item.label}</span>
                {item.badge && (
                  <span className="sidebar__nav-badge">{item.badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom Section ────────────────────────────────────────── */}
      <div className="sidebar__bottom">
        <button
          className="sidebar__logout-btn"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  );
}
