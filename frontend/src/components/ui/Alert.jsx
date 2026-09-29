import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';

// The text prefix means the meaning is not carried by color alone.
const VARIANTS = {
  error: { role: 'alert', prefix: LABELS.ALERT_ERROR_PREFIX },
  success: { role: 'status', prefix: LABELS.ALERT_SUCCESS_PREFIX },
};

/**
 * A message box for form-level feedback, announced to screen readers.
 * @param {object} props
 * @param {React.ReactNode} props.children - Message text.
 * @param {'error'|'success'} [props.variant='error'] - Visual style and announcement type.
 */
function Alert({ children, variant = 'error' }) {
  const { role, prefix } = VARIANTS[variant];

  return (
    <div className={`alert alert--${variant}`} role={role}>
      <strong className="alert__prefix">{prefix}</strong> {children}
    </div>
  );
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['error', 'success']),
};

export default Alert;
