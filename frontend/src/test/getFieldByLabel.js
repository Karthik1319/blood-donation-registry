import { screen } from '@testing-library/react';

// Required labels end with a "*" marker, so match on how the label starts, not the whole text.
export function getFieldByLabel(label) {
  return screen.getByLabelText(new RegExp(`^${label}`));
}
