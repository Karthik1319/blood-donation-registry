import { useMemo } from 'react';
import PropTypes from 'prop-types';
import FormActions from '@/components/ui/FormActions';
import Input from '@/components/ui/Input';
import { LABELS, PLACEHOLDERS } from '@/constants/labels';
import { createDonationSchema } from '@/features/donations/donationSchema';
import { useForm } from '@/hooks/useForm';

/**
 * The one donation form, used for both "Add donation" and "Edit donation". Validated live with
 * Zod, including the 90-day rule against the donor's other donations.
 * @param {object} props
 * @param {{donationDate: string, quantity: string, location: string}} props.initialValues
 * @param {{id: number, donationDate: string}[]} props.donations - the donor's donations.
 * @param {number} [props.editingId] - id of the donation being edited (not compared to itself).
 * @param {Function} props.onSubmit - async, called with the validated values.
 * @param {string} props.submitLabel - submit button text.
 * @param {string} props.cancelTo - route the Cancel link goes back to.
 */
function DonationForm({ initialValues, donations, editingId, onSubmit, submitLabel, cancelTo }) {
  // Rebuilt only when the donor's donations change, not on every keystroke.
  const schema = useMemo(() => createDonationSchema(donations, editingId), [donations, editingId]);
  const { getFieldProps, handleSubmit, isSubmitting } = useForm(schema, initialValues);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        {...getFieldProps('donationDate')}
        label={LABELS.DONATION_DATE}
        type="date"
        isRequired
      />
      <Input
        {...getFieldProps('quantity')}
        label={LABELS.QUANTITY_ML}
        type="number"
        placeholder={PLACEHOLDERS.QUANTITY}
        isRequired
      />
      <Input
        {...getFieldProps('location')}
        label={LABELS.LOCATION}
        placeholder={PLACEHOLDERS.LOCATION}
        isRequired
      />
      <FormActions
        cancelTo={cancelTo}
        cancelLabel={LABELS.CANCEL}
        submitLabel={submitLabel}
        submittingLabel={LABELS.SAVING}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

DonationForm.propTypes = {
  initialValues: PropTypes.shape({
    donationDate: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
  donations: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number.isRequired, donationDate: PropTypes.string.isRequired }),
  ).isRequired,
  editingId: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  cancelTo: PropTypes.string.isRequired,
};

export default DonationForm;
