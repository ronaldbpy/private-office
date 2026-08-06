import { useState } from "react";

export interface ValidationRules {
  [field: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface ValidationErrors {
  [field: string]: string;
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (formData: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};

    Object.entries(rules).forEach(([field, rule]) => {
      const value = formData[field];

      if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
        newErrors[field] = `${field} es requerido`;
        return;
      }

      if (value && typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          newErrors[field] = `Mínimo ${rule.minLength} caracteres`;
          return;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          newErrors[field] = `Máximo ${rule.maxLength} caracteres`;
          return;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[field] = "Formato inválido";
          return;
        }
      }

      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          newErrors[field] = customError;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearAllErrors = () => setErrors({});

  return { errors, validate, clearError, clearAllErrors };
}
