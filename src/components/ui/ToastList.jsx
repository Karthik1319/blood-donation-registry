import PropTypes from 'prop-types';
import { TOAST_TYPES } from '@/constants/config';

/**
 * Stack of toast notifications in the corner of the screen. Each toast shows an icon as well as a
 * color, so color is never the only signal. The list is always on the page as a polite live region
 * (screen readers only announce regions that already exist); errors also use role="alert".
 * @param {object} props
 * @param {{id: number, type: string, message: string}[]} props.toasts - toasts to show.
 * @param {Function} props.onDismiss - called with a toast id when its close button is pressed.
 * @param {string} props.regionLabel - name of the notifications region.
 * @param {string} props.dismissLabel - screen-reader text of the close button.
 * @param {string} props.dismissIcon - visible text of the close button.
 * @param {string} props.successIcon - icon for success toasts.
 * @param {string} props.errorIcon - icon for error toasts.
 */
function ToastList({
  toasts,
  onDismiss,
  regionLabel,
  dismissLabel,
  dismissIcon,
  successIcon,
  errorIcon,
}) {
  return (
    <section className="toast-list" aria-label={regionLabel} aria-live="polite">
      {toasts.map((toast) => {
        const isError = toast.type === TOAST_TYPES.ERROR;
        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role={isError ? 'alert' : undefined}
          >
            <span aria-hidden="true">{isError ? errorIcon : successIcon}</span>
            <p className="toast__message">{toast.message}</p>
            <button
              type="button"
              className="toast__close"
              aria-label={dismissLabel}
              onClick={() => onDismiss(toast.id)}
            >
              {dismissIcon}
            </button>
          </div>
        );
      })}
    </section>
  );
}

ToastList.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf(Object.values(TOAST_TYPES)).isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
  regionLabel: PropTypes.string.isRequired,
  dismissLabel: PropTypes.string.isRequired,
  dismissIcon: PropTypes.string.isRequired,
  successIcon: PropTypes.string.isRequired,
  errorIcon: PropTypes.string.isRequired,
};

export default ToastList;
