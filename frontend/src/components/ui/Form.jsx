import PropTypes from 'prop-types';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * Renders a list of fields, a form-level error and a submit button from a field definition array.
 * @param {object} props
 * @param {Array<object>} props.fields - Field definitions (name, label, type, hint, ...).
 * @param {object} props.form - The object returned by useZodForm (values, errors, handlers...).
 * @param {string} props.submitLabel - Submit button text.
 * @param {string} props.submittingLabel - Submit button text while the request is running.
 */
function Form({ fields, form, submitLabel, submittingLabel }) {
  return (
    // noValidate turns off browser popups so Zod is the single source of validation messages.
    <form className="form" onSubmit={form.handleSubmit} noValidate>
      {form.formError && <Alert variant="error">{form.formError}</Alert>}
      {fields.map((field) => (
        <Input
          key={field.name}
          id={field.name}
          {...field}
          value={form.values[field.name]}
          error={form.errors[field.name]}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
      ))}
      <Button type="submit" isFullWidth isLoading={form.isSubmitting} loadingText={submittingLabel}>
        {submitLabel}
      </Button>
    </form>
  );
}

Form.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, label: PropTypes.string.isRequired }),
  ).isRequired,
  form: PropTypes.shape({
    values: PropTypes.objectOf(PropTypes.string).isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    formError: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }).isRequired,
  submitLabel: PropTypes.string.isRequired,
  submittingLabel: PropTypes.string.isRequired,
};

export default Form;
