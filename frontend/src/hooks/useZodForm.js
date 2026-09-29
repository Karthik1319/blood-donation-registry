import { useMemo, useState } from 'react';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { getFieldErrors } from '@/utils/getFieldErrors';

// Only fields the user has interacted with show errors, so a fresh form isn't covered in red.
function getVisibleErrors(schema, values, touched) {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const allErrors = getFieldErrors(result.error);
  return Object.fromEntries(Object.entries(allErrors).filter(([field]) => touched[field]));
}

/**
 * Holds form values and shows live Zod errors for every field the user has typed in or left.
 * @param {object} options
 * @param {import('zod').ZodType} options.schema - Zod schema describing valid values.
 * @param {object} options.initialValues - Starting value for every field.
 * @param {(data: object) => Promise<void>} options.onSubmit - Called with parsed, valid data.
 */
export function useZodForm({ schema, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  // Errors are recalculated from the values on every change, which is what makes them "live".
  const errors = useMemo(
    () => getVisibleErrors(schema, values, touched),
    [schema, values, touched],
  );

  const markTouched = (name) => setTouched((previous) => ({ ...previous, [name]: true }));
  const markAllTouched = () =>
    setTouched(Object.fromEntries(Object.keys(initialValues).map((name) => [name, true])));
  const submit = useFormSubmit({ schema, values, markAllTouched, onSubmit });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    markTouched(name);
  };

  const handleBlur = (event) => markTouched(event.target.name);

  return { values, errors, handleChange, handleBlur, ...submit };
}
