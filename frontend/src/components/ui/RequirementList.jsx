import PropTypes from 'prop-types';
import RequirementItem from '@/components/ui/RequirementItem';
import { rulePropType } from '@/components/ui/rulePropType';

function getStatus(rule, value) {
  if (!value) return 'pending';
  return rule.pattern.test(value) ? 'met' : 'unmet';
}

/**
 * A live checklist that marks each rule as met or unmet for the current value.
 * @param {object} props
 * @param {string} props.id - Id referenced by the input's aria-describedby.
 * @param {Array<{id: string, label: string, pattern: RegExp}>} props.rules - Rules to check.
 * @param {string} props.value - Current field value.
 */
function RequirementList({ id, rules, value }) {
  return (
    <ul id={id} className="requirements">
      {rules.map((rule) => (
        <RequirementItem key={rule.id} label={rule.label} status={getStatus(rule, value)} />
      ))}
    </ul>
  );
}

RequirementList.propTypes = {
  id: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(rulePropType).isRequired,
  value: PropTypes.string.isRequired,
};

export default RequirementList;
