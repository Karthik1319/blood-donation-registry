import PropTypes from 'prop-types';

// Shape of one validation rule (see constants/passwordRules.js), shared by several components.
export const rulePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  pattern: PropTypes.instanceOf(RegExp).isRequired,
});
