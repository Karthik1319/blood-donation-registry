import PropTypes from 'prop-types';

/**
 * Text shown while data is loading; announced politely to screen readers.
 * @param {object} props
 * @param {string} props.message - text to show (e.g. "Loading...").
 */
function LoadingMessage({ message }) {
  return (
    <p className="loading" role="status">
      {message}
    </p>
  );
}

LoadingMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default LoadingMessage;
