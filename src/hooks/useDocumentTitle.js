import { useEffect } from 'react';
import { LABELS } from '@/constants/labels';

/** Sets the browser tab title, e.g. "Donors | Blood Donation Registry". */
export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = LABELS.documentTitle(pageTitle);
  }, [pageTitle]);
}
