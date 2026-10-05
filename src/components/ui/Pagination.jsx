import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';

/**
 * Previous / Next buttons with a "Page X of Y" status. Renders nothing for a single page.
 * @param {object} props
 * @param {number} props.page - current page, starting at 0.
 * @param {number} props.totalPages - total number of pages.
 * @param {Function} props.onPageChange - called with the new page number.
 * @param {string} props.statusText - e.g. "Page 1 of 3".
 * @param {string} props.previousLabel - text of the Previous button.
 * @param {string} props.nextLabel - text of the Next button.
 * @param {string} props.ariaLabel - name of the pagination landmark.
 */
function Pagination({
  page,
  totalPages,
  onPageChange,
  statusText,
  previousLabel,
  nextLabel,
  ariaLabel,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label={ariaLabel}>
      <Button variant="secondary" onClick={() => onPageChange(page - 1)} isDisabled={page === 0}>
        {previousLabel}
      </Button>
      <span aria-live="polite">{statusText}</span>
      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        isDisabled={page >= totalPages - 1}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  statusText: PropTypes.string.isRequired,
  previousLabel: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

export default Pagination;
