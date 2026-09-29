import PropTypes from 'prop-types';
import { Link } from 'react-router';

/**
 * "Don't have an account? Register" style line under the auth forms.
 * @param {object} props
 * @param {string} props.text - question text.
 * @param {string} props.linkText - text of the link.
 * @param {string} props.to - route the link goes to.
 */
function AuthSwitchLink({ text, linkText, to }) {
  return (
    <p className="form-footer">
      {text} <Link to={to}>{linkText}</Link>
    </p>
  );
}

AuthSwitchLink.propTypes = {
  text: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default AuthSwitchLink;
