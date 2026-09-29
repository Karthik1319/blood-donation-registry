import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';

/**
 * A form label with an optional required marker.
 * @param {object} props
 * @param {string} props.htmlFor - Id of the input this label describes.
 * @param {string} props.text - Label text.
 * @param {boolean} [props.isRequired=false] - Shows the required marker.
 */
function FieldLabel({ htmlFor, text, isRequired = false }) {
  return (
    <label htmlFor={htmlFor} className="field__label">
      {text}
      {/* aria-hidden: screen readers already announce "required" from the input itself. */}
      {isRequired && (
        <span className="field__required" aria-hidden="true">
          {LABELS.REQUIRED_MARK}
        </span>
      )}
    </label>
  );
}

FieldLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
};

export default FieldLabel;
