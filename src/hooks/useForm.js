import { useState } from 'react';
import { MESSAGES } from '@/constants/messages';
import { getFieldErrors } from '@/utils/getFieldErrors';

/**
 * Handles form values, live Zod validation and submitting state for any form.
 * Errors are shown for a field once the user has typed in it or left it (live validation),
 * and for every field after a submit attempt.
 */
export function useForm(schema, initialValues) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Errors are calculated from values on every render instead of stored, so they never go stale.
  const allErrors = getFieldErrors(schema, values);
  const getError = (name) => (touched[name] || isSubmitAttempted ? (allErrors[name] ?? '') : '');

  const markTouched = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  const getFieldProps = (name) => ({
    id: name,
    value: values[name],
    error: getError(name),
    onChange: (event) => {
      setValues((prev) => ({ ...prev, [name]: event.target.value }));
      markTouched(name);
    },
    onBlur: () => markTouched(name),
  });

  const handleSubmit = (onValidSubmit) => async (event) => {
    event.preventDefault();
    setIsSubmitAttempted(true);
    const result = schema.safeParse(values);
    if (!result.success || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onValidSubmit(result.data);
    } catch (error) {
      setSubmitError(error.message || MESSAGES.GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, getFieldProps, handleSubmit, isSubmitting, submitError };
}
