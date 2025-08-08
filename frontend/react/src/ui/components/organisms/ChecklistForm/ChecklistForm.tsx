import React, { useState, useEffect } from 'react';
import { Button, Checkbox } from '@ui/components/atoms';
import type { CreateChecklistRequest } from '@shared/types';
import './ChecklistForm.scss';

export interface ChecklistFormProps {
  onSubmit: (data: CreateChecklistRequest) => void;
  onCancel?: () => void;
  onReset?: () => void;
  forceReset?: boolean;
  loading?: boolean;
  className?: string;
}

export const ChecklistForm: React.FC<ChecklistFormProps> = ({
  onSubmit,
  onCancel,
  onReset,
  forceReset = false,
  loading = false,
  className = '',
}) => {
  const [formData, setFormData] = useState<CreateChecklistRequest>({
    tank_full: false,
    has_step: false,
    has_license: false,
  });

  const resetForm = () => {
    setFormData({
      tank_full: false,
      has_step: false,
      has_license: false,
    });

    onCancel?.();
    
    if (onReset) {
      onReset();
    }
  };

  useEffect(() => {
    if (forceReset) {
      resetForm();
    }
  }, [forceReset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
  };

  const handleCheckboxChange = (field: keyof CreateChecklistRequest) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={`checklist-form ${className}`}>
      <div className="checklist-form__fields">
        <Checkbox
          label="Tanque cheio"
          checked={formData.tank_full}
          onChange={handleCheckboxChange('tank_full')}
          helperText="Verificar se o tanque está completamente abastecido"
        />

        <Checkbox
          label="Com step"
          checked={formData.has_step}
          onChange={handleCheckboxChange('has_step')}
          helperText="Confirmar presença do step no veículo"
        />

        <Checkbox
          label="Com CNH"
          checked={formData.has_license}
          onChange={handleCheckboxChange('has_license')}
          helperText="Verificar se a CNH está em mãos"
        />
      </div>

      <div className="checklist-form__actions">
      <p className="checklist-form__description">
          *Verifique todos os itens antes de prosseguir.
        </p>
        {onCancel && (
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              resetForm();
            }}
            disabled={loading}
            className="checklist-form__cancel"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="checklist-form__submit"
        >
          Criar
        </Button>
      </div>
    </form>
  );
};