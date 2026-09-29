import PropTypes from 'prop-types';
import { getErrorId } from '@/utils/getErrorId';

/**
 * Wraps any form control with a visible label and an announced error message.
 * @param {object} props
 * @param {string} props.id - id of the control; links the label via htmlFor.
 * @param {string} props.label - visible label text.
 * @param {string} [props.error] - error text; nothing is shown when empty.
 * @param {boolean} [props.isRequired] - shows a required marker next to the label.
 * @param {React.ReactNode} props.children - the actual control (input, select...).
 */
function FormField({ id, label, error = '', isRequired = false, children }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {isRequired && (
          <span className="field__required" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={getErrorId(id)} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default FormField;
