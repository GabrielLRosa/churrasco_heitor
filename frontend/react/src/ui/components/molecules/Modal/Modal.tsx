import React, { useEffect, useRef } from 'react';
import { Button } from '../../atoms/Button';
import { useClickOutside } from '../../../hooks';
import { IoIosCloseCircle } from "react-icons/io";
import './Modal.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { ref: clickOutsideRef } = useClickOutside({
    onOutsideClick: closeOnOverlayClick ? onClose : undefined,
    onEscape: closeOnEscape ? onClose : undefined,
    enabled: isOpen,
    escapeEnabled: closeOnEscape,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div 
        ref={clickOutsideRef}
        className={`modal modal--${size} ${className}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 id="modal-title" className="modal__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="secondary"
                size="small"
                onClick={onClose}
                className="modal__close-button"
                aria-label="Fechar modal"
              >
                <IoIosCloseCircle size={24} />
              </Button>
            )}
          </div>
        )}
        
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};