import PropTypes from 'prop-types';
import { Link } from 'react-router';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';

/**
 * Full-page message with a way back, used for 403 (access denied), 404 (not found) and crashes.
 * @param {object} props
 * @param {string} props.title - heading, e.g. "404 - Page not found".
 * @param {string} props.message - what happened and what to do.
 * @param {React.ReactNode} [props.action] - extra button, e.g. "Try again" after a crash.
 */
function StatusPage({ title, message, action = null }) {
  return (
    <section className="page">
      <PageHeader title={title} subtitle={message} />
      <div className="status-actions">
        {action}
        <Link to={ROUTES.DASHBOARD} className="button button--primary">
          {LABELS.BACK_TO_DASHBOARD}
        </Link>
      </div>
    </section>
  );
}

StatusPage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.node,
};

export default StatusPage;
