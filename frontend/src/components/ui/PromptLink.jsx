import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A short question followed by an in-app link, e.g. "Already have an account? Sign in".
 * @param {object} props
 * @param {string} props.prompt - Text before the link.
 * @param {string} props.to - Route path to navigate to.
 * @param {string} props.linkText - Visible link text.
 */
function PromptLink({ prompt, to, linkText }) {
  return (
    <p className="prompt-link">
      {prompt} <Link to={to}>{linkText}</Link>
    </p>
  );
}

PromptLink.propTypes = {
  prompt: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};

export default PromptLink;
