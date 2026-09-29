import PropTypes from 'prop-types';

/**
 * Message box for form-level results (e.g. "Invalid email or password").
 * Renders nothing when there is no message.
 * @param {object} props
 * @param {string} [props.message] - text to show.
 * @param {'error'|'success'} [props.variant] - visual style.
 */
function Alert({ message = '', variant = 'error' }) {
  if (!message) {
    return null;
  }

  return (
    <p className={`alert alert--${variant}`} role="alert">
      {message}
    </p>
  );
}

Alert.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'success']),
};

export default Alert;
