import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ToastList from '@/components/ui/ToastList';
import { APP_CONFIG } from '@/constants/config';
import { LABELS } from '@/constants/labels';
import { ToastContext } from '@/context/ToastContext';

/**
 * Keeps the list of visible toasts and provides showToast(type, message) to the app.
 * Each toast disappears after TOAST_DURATION_MS or when its close button is pressed.
 * @param {object} props
 * @param {React.ReactNode} props.children - the app.
 */
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(1);
  const timersRef = useRef(new Map());

  const dismissToast = (id) => {
    clearTimeout(timersRef.current.get(id));
    timersRef.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = (type, message) => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    setToasts((current) => [...current, { id, type, message }]);
    timersRef.current.set(
      id,
      setTimeout(() => dismissToast(id), APP_CONFIG.TOAST_DURATION_MS),
    );
  };

  // Stop pending timers if the provider is ever removed (e.g. between tests).
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList
        toasts={toasts}
        onDismiss={dismissToast}
        regionLabel={LABELS.NOTIFICATIONS}
        dismissLabel={LABELS.DISMISS_NOTIFICATION}
        dismissIcon={LABELS.DISMISS_ICON}
        successIcon={LABELS.SUCCESS_ICON}
        errorIcon={LABELS.ERROR_ICON}
      />
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastProvider;
