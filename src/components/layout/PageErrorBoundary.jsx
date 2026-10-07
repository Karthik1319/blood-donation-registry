import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import StatusPage from '@/pages/StatusPage';

function CrashMessage({ resetErrorBoundary }) {
  // The error itself is never shown: stack traces are for developers, not users.
  return (
    <StatusPage
      title={LABELS.CRASH_TITLE}
      message={LABELS.CRASH_TEXT}
      action={
        <Button variant="secondary" onClick={resetErrorBoundary}>
          {LABELS.RETRY}
        </Button>
      }
    />
  );
}

CrashMessage.propTypes = {
  resetErrorBoundary: PropTypes.func.isRequired,
};

/**
 * If a page crashes while rendering, shows a friendly message inside the layout instead of a
 * blank screen. Going to another page clears the error automatically.
 * @param {object} props
 * @param {React.ReactNode} props.children - the page.
 */
function PageErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary FallbackComponent={CrashMessage} resetKeys={[pathname]}>
      {children}
    </ErrorBoundary>
  );
}

PageErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageErrorBoundary;
