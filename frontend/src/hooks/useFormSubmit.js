import { useState } from 'react';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getFieldErrors } from '@/utils/getFieldErrors';

// Moves keyboard and screen-reader focus to the first invalid field after a failed submit.
function focusFirstInvalidField(formElement, fieldErrors) {
  const [firstField] = Object.keys(fieldErrors);
  formElement.elements.namedItem(firstField)?.focus();
}

/**
 * Validates all values on submit, then calls onSubmit while tracking loading and server errors.
 * @param {object} options
 * @param {import('zod').ZodType} options.schema - Zod schema describing valid values.
 * @param {object} options.values - Current form values.
 * @param {(errors: object) => void} options.setErrors - Replaces the per-field error messages.
 * @param {(data: object) => Promise<void>} options.onSubmit - Called with parsed, valid data.
 */
export function useFormSubmit({ schema, values, setErrors, onSubmit }) {
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Guards against a second submit (e.g. pressing Enter twice) while a request is running.
    if (isSubmitting) return;
    const result = schema.safeParse(values);
    const fieldErrors = result.success ? {} : getFieldErrors(result.error);
    setErrors(fieldErrors);
    if (!result.success) {
      focusFirstInvalidField(event.currentTarget, fieldErrors);
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formError, isSubmitting, handleSubmit };
}
