import PropTypes from 'prop-types';
import FieldMessage from '@/components/ui/FieldMessage';
import RequirementList from '@/components/ui/RequirementList';
import { rulePropType } from '@/components/ui/rulePropType';

/**
 * Help text under a field label: a live requirements checklist if rules are given, else plain text.
 * @param {object} props
 * @param {string} props.id - Id referenced by the input's aria-describedby.
 * @param {string} [props.hint=''] - Plain helper text.
 * @param {Array<object>} [props.requirements=null] - Rules for a live checklist.
 * @param {string} props.value - Current field value, checked against the rules.
 */
function FieldHint({ id, hint = '', requirements = null, value }) {
  if (requirements) return <RequirementList id={id} rules={requirements} value={value} />;
  return <FieldMessage id={id} message={hint} />;
}

FieldHint.propTypes = {
  id: PropTypes.string.isRequired,
  hint: PropTypes.string,
  requirements: PropTypes.arrayOf(rulePropType),
  value: PropTypes.string.isRequired,
};

export default FieldHint;
