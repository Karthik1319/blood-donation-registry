import PropTypes from 'prop-types';
import FormField from '@/components/ui/FormField';
import { getErrorId } from '@/utils/getErrorId';

/**
 * Labelled text input with an error message.
 * @param {object} props
 * @param {string} props.id - unique id; also used as the input name.
 * @param {string} props.label - visible label text.
 * @param {string} [props.type] - HTML input type (text, email, password, tel...).
 * @param {string} props.value - current value (controlled input).
 * @param {Function} props.onChange - called on every keystroke.
 * @param {Function} [props.onBlur] - called when the input loses focus.
 * @param {string} [props.error] - error text; marks the input invalid when set.
 * @param {boolean} [props.isRequired] - shows the required marker.
 * @param {string} [props.placeholder] - hint text inside the input.
 * @param {string} [props.autoComplete] - browser autofill hint.
 */
function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error = '',
  isRequired = false,
  placeholder = '',
  autoComplete = 'off',
}) {
  const hasError = Boolean(error);

  return (
    <FormField id={id} label={label} error={error} isRequired={isRequired}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={isRequired}
        aria-invalid={hasError}
        aria-describedby={hasError ? getErrorId(id) : undefined}
        className={`field__control ${hasError ? 'field__control--invalid' : ''}`}
      />
    </FormField>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
};

export default Input;
