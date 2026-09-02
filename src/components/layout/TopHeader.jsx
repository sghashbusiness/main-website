/**
 * SGHASH — TopHeader
 */

import { useState } from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../mock-data/users';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import PillButton from '../ui/PillButton';
import './TopHeader.css';

export default function TopHeader() {
  const location = useLocation();
  const { user, role } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Simple mapping for demo purposes
  const titleMap = {
    '/': 'Dashboard',
    '/inventory': 'Stock Operations',
    '/pos': 'Point of Sale'
  };

  const pageTitle = titleMap[location.pathname] || 'Dashboard';

  return (
    <>
      <header className="top-header">
      <div className="top-header__left">
        <h1 className="top-header__title">{pageTitle}</h1>
      </div>

      <div className="top-header__right">
        <button className="top-header__icon-btn" title="Notifications" aria-label="Notifications">
          <Bell size={20} />
          <span className="top-header__notification-dot" />
        </button>
        <button className="top-header__profile" onClick={() => setIsProfileModalOpen(true)}>
          <div className="top-header__avatar">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="top-header__profile-info">
            <span className="top-header__profile-name">{user?.displayName}</span>
            <span className="top-header__profile-role">{ROLE_LABELS[role] || role}</span>
          </div>
        </button>
      </div>
    </header>

    <Modal
      isOpen={isProfileModalOpen}
      onClose={() => setIsProfileModalOpen(false)}
      title="Edit Profile"
    >
      <div className="flex-column" style={{ gap: '16px', padding: '8px 0' }}>
        <InputField label="Profile Picture" type="file" />
        <InputField label="Display Name" defaultValue={user?.displayName} />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <PillButton onClick={() => setIsProfileModalOpen(false)}>Save Changes</PillButton>
        </div>
      </div>
    </Modal>
  </>
  );
}

