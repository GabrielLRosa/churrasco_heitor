import { useState, useEffect, useCallback } from 'react';

export type ToastState = {
  isVisible: boolean;
  message?: string;
  variant?: 'danger' | 'success' | 'warning';
  time?: number;
};

export type ShowToastOptions = Omit<ToastState, 'isVisible'>;

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
  });

  const showToast = useCallback((options: ShowToastOptions) => {
    setToastState({
      isVisible: true,
      message: options.message,
      variant: options.variant,
      time: options.time || 2000,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState({ ...toastState, isVisible: false });
  }, [toastState]);

  useEffect(() => {
    if (toastState.isVisible && toastState.time) {
      const timer = setTimeout(() => {
        hideToast();
      }, toastState.time);

      return () => clearTimeout(timer);
    }
  }, [toastState, hideToast]);

  return { toastState, showToast, hideToast };
};