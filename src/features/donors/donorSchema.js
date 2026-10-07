import { z } from 'zod';
import { bloodGroupField, nameField, phoneField } from '@/schemas/fieldSchemas';

// Used by DonorForm for both "Add donor" and "Edit donor".
export const donorSchema = z.object({
  name: nameField,
  bloodGroup: bloodGroupField,
  phone: phoneField,
});

export const DONOR_INITIAL_VALUES = { name: '', bloodGroup: '', phone: '' };

/** Picks only the form fields from a donor returned by the API (drops id etc.). */
export function toDonorFormValues({ name, bloodGroup, phone }) {
  return { name, bloodGroup, phone };
}
