import React from "react";
import { FaCheck } from "react-icons/fa6";
import "./Checkbox.scss";

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
  required = false,
  error,
  helperText,
  onChange,
  className = "",
  id,
}) => {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = Boolean(error);

  const checkboxClasses = [
    "checkbox",
    hasError ? "checkbox--error" : "",
    disabled ? "checkbox--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={checkboxClasses}>
        {label && (
          <label htmlFor={checkboxId} className="checkbox__label">
            <input
              id={checkboxId}
              type="checkbox"
              className="checkbox__input"
              checked={checked}
              disabled={disabled}
              required={required}
              onChange={(e) => onChange?.(e.target.checked)}
            />
            <div className="checkbox__checkmark">
              {checked && (
                <span className="checkbox__check">
                  <FaCheck size={10} />
                </span>
              )}
            </div>

            {label}
            {required && <span className="checkbox__required">*</span>}
          </label>
        )}
      

      {error && <span className="checkbox__error">{error}</span>}
      {helperText && !error && (
        <span className="checkbox__helper">{helperText}</span>
      )}
    </div>
  );
};
