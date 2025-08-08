// frontend/react/src/components/Toast/Toast.tsx

import React from 'react';
import './Toast.scss';
import type { ToastState } from '../../../hooks/useToast';
import { IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5';

export interface ToastProps extends ToastState {
  onDismiss?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'primary',
  time = 2000,
  onDismiss,
  className = '',
  isVisible,
}) => {
  const baseClass = 'toast';
  const variantClass = `toast--${variant}`;
  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ');

  const handleClick = () => {
    onDismiss?.();
  };

  return (
    isVisible && (
      <div
        className={classes}
        onClick={handleClick}
        style={{ '--toast-time': `${time}ms` } as React.CSSProperties}
      >
        <div className="toast__content">
            {
                variant === 'success' && (
                    <IoCheckmarkCircle
                        size={24}
                    />
                )
            }{

                variant === 'danger' && (
                    <IoCloseCircle
                        size={24}
                    />
                )
            }{

                variant === 'warning' && (
                    <IoWarning
                        size={24}
                    />
                )
            }
          <p className="toast__content-msg">{message}</p>
          <span className="toast__content-line" />
        </div>
      </div>
    )
  );
};