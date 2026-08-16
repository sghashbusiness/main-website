/**
 * SGHASH — CredentialManagerModal
 * Owner IAM controls.
 */

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import PillButton from '../../../components/ui/PillButton';
import { forcePasswordReset, suspendSession } from '../../../services/staffService';
import { useToast } from '../../../hooks/useToast';
import { AlertTriangle, Key, Ban } from 'lucide-react';

export default function CredentialManagerModal({ isOpen, onClose, staff, onActionComplete }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  if (!staff) return null;

  const handleForceReset = async () => {
    setLoading(true);
    const res = await forcePasswordReset(staff.id);
    setLoading(false);
    
    if (res.success) {
      toastSuccess(res.data.message);
      if (onActionComplete) onActionComplete();
      onClose();
    } else {
      toastError(res.error);
    }
  };

  const handleSuspend = async () => {
    setLoading(true);
    const res = await suspendSession(staff.id);
    setLoading(false);
    
    if (res.success) {
      toastSuccess(res.data.message);
      if (onActionComplete) onActionComplete();
      onClose();
    } else {
      toastError(res.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Credential Manager">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div style={{ background: 'var(--color-canvas-subtle)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontWeight: 600 }}>{staff.name}</div>
          <div className="text-small text-on-canvas-muted">{staff.role} • {staff.email}</div>
          <div className="text-small" style={{ marginTop: 'var(--space-xs)', color: staff.status === 'active' ? 'var(--color-primary)' : 'var(--color-danger)' }}>
            Status: {staff.status.toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <PillButton 
              variant="secondary" 
              fullWidth 
              icon={Key}
              loading={loading}
              onClick={handleForceReset}
            >
              Force Password Reset
            </PillButton>
            <PillButton 
              variant="danger" 
              fullWidth 
              icon={Ban}
              loading={loading}
              onClick={handleSuspend}
              disabled={staff.status !== 'active'}
            >
              Suspend Account
            </PillButton>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)', color: 'var(--color-warning)', background: 'var(--color-warning-subtle)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span className="text-xs">
              Actions taken here are immediate. Suspending an account terminates all active sessions.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
