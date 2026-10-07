import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BLOOD_GROUPS } from '@/constants/config';
import { LABELS, PLACEHOLDERS } from '@/constants/labels';
import { donorSchema } from '@/features/donors/donorSchema';
import { useForm } from '@/hooks/useForm';

/**
 * The one donor form, used for both "Add donor" and "Edit donor"; only the starting values and
 * button text differ. Validated live with donorSchema (Zod), like the Day 1 forms.
 * @param {object} props
 * @param {{name: string, bloodGroup: string, phone: string}} props.initialValues - starting values.
 * @param {Function} props.onSubmit - async, called with the validated values.
 * @param {string} props.submitLabel - submit button text.
 * @param {string} props.cancelTo - route the Cancel link goes back to.
 */
function DonorForm({ initialValues, onSubmit, submitLabel, cancelTo }) {
  const { getFieldProps, handleSubmit, isSubmitting } = useForm(donorSchema, initialValues);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        {...getFieldProps('name')}
        label={LABELS.FULL_NAME}
        placeholder={PLACEHOLDERS.FULL_NAME}
        isRequired
      />
      <Select
        {...getFieldProps('bloodGroup')}
        label={LABELS.BLOOD_GROUP}
        options={BLOOD_GROUPS}
        placeholder={LABELS.SELECT_PLACEHOLDER}
        isRequired
      />
      <Input
        {...getFieldProps('phone')}
        label={LABELS.PHONE}
        type="tel"
        placeholder={PLACEHOLDERS.PHONE}
        isRequired
      />
      <div className="form__actions">
        <Link to={cancelTo} className="button button--secondary">
          {LABELS.CANCEL}
        </Link>
        <Button type="submit" isLoading={isSubmitting} loadingText={LABELS.SAVING}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

DonorForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bloodGroup: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  cancelTo: PropTypes.string.isRequired,
};

export default DonorForm;
