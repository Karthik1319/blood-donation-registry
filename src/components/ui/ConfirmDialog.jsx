import { useEffect, useId, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';

/**
 * Modal "Are you sure?" dialog for destructive actions. Render it only while it should be open.
 * Uses the native <dialog>: showModal() keeps focus inside and makes the page behind inert;
 * Esc cancels; focus goes back to the button that opened it.
 * @param {object} props
 * @param {string} props.title - dialog heading.
 * @param {string} props.message - what will happen.
 * @param {string} props.confirmLabel - text of the confirm button.
 * @param {string} props.confirmingLabel - confirm button text while the action runs.
 * @param {string} props.cancelLabel - text of the cancel button.
 * @param {Function} props.onConfirm - runs the action.
 * @param {Function} props.onCancel - closes the dialog without doing anything.
 * @param {boolean} [props.isConfirming] - true while the action runs; blocks closing.
 * @param {'danger'|'primary'} [props.confirmVariant] - red for destructive actions, primary otherwise.
 * @param {React.ReactNode} [props.children] - extra content under the message, e.g. a dropdown.
 */
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmingLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isConfirming = false,
  confirmVariant = 'danger',
  children = null,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const openerElement = document.activeElement;
    if (!dialog.open) {
      dialog.showModal();
    }
    return () => {
      dialog.close();
      openerElement?.focus();
    };
  }, []);

  const handleEscape = (event) => {
    // Stop the browser closing it by itself, so React state stays the single source of truth.
    event.preventDefault();
    if (!isConfirming) {
      onCancel();
    }
  };

  return (
    <dialog ref={dialogRef} className="dialog" aria-labelledby={titleId} onCancel={handleEscape}>
      <h2 id={titleId} className="dialog__title">
        {title}
      </h2>
      <p>{message}</p>
      {children}
      <div className="dialog__actions">
        <Button variant="secondary" onClick={onCancel} isDisabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          isLoading={isConfirming}
          loadingText={confirmingLabel}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  confirmingLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
  confirmVariant: PropTypes.oneOf(['danger', 'primary']),
  children: PropTypes.node,
};

export default ConfirmDialog;
