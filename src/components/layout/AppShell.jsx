/**
 * SGHASH — AppShell
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import './AppShell.css';

export default function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <div className="app-shell__canvas">
          <TopHeader />
          <main className="app-shell__content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
