import PropTypes from 'prop-types';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import LoadingMessage from '@/components/ui/LoadingMessage';

/**
 * Shows the loading, error or empty message for fetched data; otherwise shows the children.
 * @param {object} props
 * @param {boolean} props.isLoading - request is running.
 * @param {string} props.error - error message; empty when there is none.
 * @param {boolean} props.isEmpty - request succeeded but returned no items.
 * @param {string} props.loadingText - text while loading.
 * @param {string} props.emptyText - text when there are no items.
 * @param {string} props.retryLabel - text of the retry button.
 * @param {Function} props.onRetry - runs the request again.
 * @param {React.ReactNode} props.children - the data view (e.g. a table).
 */
function AsyncContent({
  isLoading,
  error,
  isEmpty,
  loadingText,
  emptyText,
  retryLabel,
  onRetry,
  children,
}) {
  if (isLoading) {
    return <LoadingMessage message={loadingText} />;
  }
  if (error) {
    return (
      <div className="async-error">
        <Alert message={error} />
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      </div>
    );
  }
  if (isEmpty) {
    return <p className="empty-message">{emptyText}</p>;
  }
  return children;
}

AsyncContent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  loadingText: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  retryLabel: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AsyncContent;
