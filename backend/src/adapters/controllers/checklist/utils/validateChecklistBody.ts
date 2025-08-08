import { AppError } from '@core/errors/AppError';
import { API_ERROR_MESSAGES } from '@typings/constants';

interface ChecklistBody {
  tank_full: boolean;
  has_step: boolean;
  has_license: boolean;
}

type ValidationType = 'boolean' | 'string' | 'number';

interface FieldValidation {
  type: ValidationType;
  required?: boolean;
  allowNull?: boolean;
}

const CHECKLIST_FIELD_VALIDATIONS: Record<keyof ChecklistBody, FieldValidation> = {
  tank_full: { type: 'boolean', required: true },
  has_step: { type: 'boolean', required: true },
  has_license: { type: 'boolean', required: true },
};

function validateFieldType(value: any, fieldName: string, validation: FieldValidation): void {
  if (validation.required && (value === undefined || value === null)) {
    const error = API_ERROR_MESSAGES.MISSING_OR_INVALID_FIELD(fieldName);
    throw new AppError(error.message, error.statusCode);
  }

  if (value === null && validation.allowNull) {
    return;
  }

  if (value !== undefined && value !== null) {
    const actualType = typeof value;
    if (actualType !== validation.type) {
      const error = API_ERROR_MESSAGES.MISSING_OR_INVALID_FIELD(fieldName);
      throw new AppError(error.message, error.statusCode);
    }
  }
}

export function validateChecklistBody(body: any): ChecklistBody {
  const validatedBody: Partial<ChecklistBody> = {};

  for (const [fieldName, validation] of Object.entries(CHECKLIST_FIELD_VALIDATIONS)) {
    const fieldKey = fieldName as keyof ChecklistBody;
    const value = body[fieldKey];

    validateFieldType(value, fieldName, validation);
    validatedBody[fieldKey] = value;
  }

  return validatedBody as ChecklistBody;
} 