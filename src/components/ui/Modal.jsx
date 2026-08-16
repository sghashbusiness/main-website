/**
 * SGHASH UI — Modal
 * Uses native <dialog> element for accessibility.
 * Architecture Spec §3.4, §4.2: CredentialManagerModal, WarningModal, etc.
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, size = 'md', children, footer, className = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`modal modal--${size} ${className}`}
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="modal__container anim-fade-in-scale">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
