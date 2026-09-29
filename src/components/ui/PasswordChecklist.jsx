import PropTypes from 'prop-types';

/**
 * Live list of password rules: each rule is red with ✗ until met, then green with ✓.
 * The icon is shown as well as the color, so color is never the only signal.
 * @param {object} props
 * @param {string} props.password - the password typed so far.
 * @param {{id: string, label: string, pattern: RegExp}[]} props.rules - rules to check.
 * @param {string} props.title - heading above the list.
 * @param {string} props.metIcon - symbol for a satisfied rule.
 * @param {string} props.unmetIcon - symbol for an unsatisfied rule.
 */
function PasswordChecklist({ password, rules, title, metIcon, unmetIcon }) {
  return (
    <div aria-live="polite">
      <p className="checklist__title">{title}</p>
      <ul className="checklist">
        {rules.map((rule) => {
          const isMet = rule.pattern.test(password);
          return (
            <li key={rule.id} className={isMet ? 'checklist__item--met' : 'checklist__item--unmet'}>
              {isMet ? metIcon : unmetIcon} {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

PasswordChecklist.propTypes = {
  password: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      pattern: PropTypes.instanceOf(RegExp).isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
  metIcon: PropTypes.string.isRequired,
  unmetIcon: PropTypes.string.isRequired,
};

export default PasswordChecklist;
