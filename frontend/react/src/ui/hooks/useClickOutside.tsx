import { useEffect, useRef, type RefObject } from 'react';

interface UseClickOutsideOptions {
  onOutsideClick?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
  escapeEnabled?: boolean;
}

interface UseClickOutsideReturn {
  ref: RefObject<HTMLDivElement | null>;
}

export const useClickOutside = ({
  onOutsideClick,
  onEscape,
  enabled = true,
  escapeEnabled = true,
}: UseClickOutsideOptions): UseClickOutsideReturn => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        onOutsideClick
      ) {
        onOutsideClick();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    if (onOutsideClick) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    if (escapeEnabled && onEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      if (onOutsideClick) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      if (escapeEnabled && onEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
    };
  }, [onOutsideClick, onEscape, enabled, escapeEnabled]);

  return { ref };
}; 