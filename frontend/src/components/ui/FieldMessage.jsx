import PropTypes from 'prop-types';

/**
 * Helper or error text under a form field; renders nothing when the message is empty.
 * @param {object} props
 * @param {string} props.id - Id referenced by the input's aria-describedby.
 * @param {string} [props.message=''] - Text to show.
 * @param {boolean} [props.isError=false] - Error style, announced immediately with role="alert".
 */
function FieldMessage({ id, message = '', isError = false }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className={isError ? 'field__error' : 'field__hint'}
      role={isError ? 'alert' : undefined}
    >
      {message}
    </p>
  );
}

FieldMessage.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string,
  isError: PropTypes.bool,
};

export default FieldMessage;
