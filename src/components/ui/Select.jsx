import PropTypes from 'prop-types';
import FormField from '@/components/ui/FormField';
import { getErrorId } from '@/utils/getErrorId';

const toOption = (option) =>
  typeof option === 'string' ? { value: option, label: option } : option;

/**
 * Labelled dropdown with an error message.
 * @param {object} props
 * @param {string} props.id - unique id; also used as the select name.
 * @param {string} props.label - visible label text.
 * @param {(string|{value: string, label: string})[]} props.options - choices; a plain string is used
 *   as both value and text, an object shows `label` but submits `value`.
 * @param {string} [props.placeholder] - text of an empty first option; leave out to have none.
 * @param {string} props.value - currently selected value.
 * @param {Function} props.onChange - called when the selection changes.
 * @param {Function} [props.onBlur] - called when the select loses focus.
 * @param {string} [props.error] - error text; marks the select invalid when set.
 * @param {boolean} [props.isRequired] - shows the required marker.
 */
function Select({
  id,
  label,
  options,
  placeholder = '',
  value,
  onChange,
  onBlur,
  error = '',
  isRequired = false,
}) {
  const hasError = Boolean(error);

  return (
    <FormField id={id} label={label} error={error} isRequired={isRequired}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-required={isRequired}
        aria-invalid={hasError}
        aria-describedby={hasError ? getErrorId(id) : undefined}
        className={`field__control ${hasError ? 'field__control--invalid' : ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(toOption).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }),
    ]),
  ).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default Select;
