import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';

// Icon + screen-reader text per status, so the state is never shown by color alone.
const STATUS = {
  pending: { icon: LABELS.RULE_ICON_PENDING, srText: LABELS.RULE_NOT_MET },
  met: { icon: LABELS.RULE_ICON_MET, srText: LABELS.RULE_MET },
  unmet: { icon: LABELS.RULE_ICON_NOT_MET, srText: LABELS.RULE_NOT_MET },
};

/**
 * One line of a requirements checklist, e.g. "✓ One number (0–9)".
 * @param {object} props
 * @param {string} props.label - Requirement text.
 * @param {'pending'|'met'|'unmet'} props.status - pending = nothing typed yet (neutral color).
 */
function RequirementItem({ label, status }) {
  const { icon, srText } = STATUS[status];

  return (
    <li className={`requirement requirement--${status}`}>
      <span className="requirement__icon" aria-hidden="true">
        {icon}
      </span>
      {label}
      <span className="visually-hidden"> ({srText})</span>
    </li>
  );
}

RequirementItem.propTypes = {
  label: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['pending', 'met', 'unmet']).isRequired,
};

export default RequirementItem;
