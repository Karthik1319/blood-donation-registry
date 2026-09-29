import { useState } from 'react';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { getFieldErrors } from '@/utils/getFieldErrors';

/**
 * Holds form values and per-field errors, validating with a Zod schema on blur and on submit.
 * @param {object} options
 * @param {import('zod').ZodType} options.schema - Zod schema describing valid values.
 * @param {object} options.initialValues - Starting value for every field.
 * @param {(data: object) => Promise<void>} options.onSubmit - Called with parsed, valid data.
 */
export function useZodForm({ schema, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const submit = useFormSubmit({ schema, values, setErrors, onSubmit });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    // Hide the old message while the user is fixing the field; it is re-checked on blur.
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const result = schema.safeParse(values);
    const fieldErrors = result.success ? {} : getFieldErrors(result.error);
    setErrors((previous) => ({ ...previous, [name]: fieldErrors[name] }));
  };

  return { values, errors, handleChange, handleBlur, ...submit };
}
