import PropTypes from 'prop-types';
import FieldLabel from '@/components/ui/FieldLabel';
import FieldMessage from '@/components/ui/FieldMessage';

/**
 * A labelled input with optional hint and error text, linked for screen readers.
 * @param {object} props
 * @param {string} props.id - Unique id; links the label, hint and error to the input.
 * @param {string} props.name - Field name; must match the key in the form's values.
 * @param {string} props.label - Visible label text.
 * @param {string} props.value - Current value (controlled input).
 * @param {Function} props.onChange - Called on every keystroke.
 * @param {Function} [props.onBlur] - Called when the input loses focus.
 * @param {string} [props.type] - Native input type; the browser default is 'text'.
 * @param {string} [props.error=''] - Error message; when set the input is marked invalid.
 * @param {string} [props.hint=''] - Helper text shown under the label.
 * @param {boolean} [props.isRequired=true] - Shows the required marker and sets `required`.
 * @param {boolean} [props.isDisabled=false] - Disables the input.
 * @param {string} [props.autoComplete='off'] - Browser autofill hint.
 * @param {string} [props.inputMode] - Virtual keyboard hint for mobile devices.
 */
function Input({
  id,
  label,
  error = '',
  hint = '',
  isRequired = true,
  isDisabled = false,
  ...rest
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ');

  return (
    <div className="field">
      <FieldLabel htmlFor={id} text={label} isRequired={isRequired} />
      <FieldMessage id={hintId} message={hint} />
      <input
        autoComplete="off"
        {...rest}
        id={id}
        className={error ? 'field__input field__input--invalid' : 'field__input'}
        required={isRequired}
        disabled={isDisabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
      />
      <FieldMessage id={errorId} message={error} isError />
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['text', 'email', 'password', 'tel', 'number', 'date', 'search']),
  error: PropTypes.string,
  hint: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  autoComplete: PropTypes.string,
  inputMode: PropTypes.oneOf(['text', 'numeric', 'decimal', 'tel', 'email']),
};

export default Input;
