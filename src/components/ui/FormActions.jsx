import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from '@/components/ui/Button';

/**
 * Cancel link + submit button at the bottom of a form. The submit button is disabled while
 * saving, which prevents double submits.
 * @param {object} props
 * @param {string} props.cancelTo - route the Cancel link goes back to.
 * @param {string} props.cancelLabel - Cancel link text.
 * @param {string} props.submitLabel - submit button text.
 * @param {string} props.submittingLabel - submit button text while saving.
 * @param {boolean} props.isSubmitting - true while the save request runs.
 */
function FormActions({ cancelTo, cancelLabel, submitLabel, submittingLabel, isSubmitting }) {
  return (
    <div className="form__actions">
      <Link to={cancelTo} className="button button--secondary">
        {cancelLabel}
      </Link>
      <Button type="submit" isLoading={isSubmitting} loadingText={submittingLabel}>
        {submitLabel}
      </Button>
    </div>
  );
}

FormActions.propTypes = {
  cancelTo: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
  submitLabel: PropTypes.string.isRequired,
  submittingLabel: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default FormActions;
