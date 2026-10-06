import { Link } from 'react-router';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';

function AccessDeniedPage() {
  return (
    <section className="page">
      <PageHeader title={LABELS.ACCESS_DENIED_TITLE} subtitle={LABELS.ACCESS_DENIED_TEXT} />
      <Link to={ROUTES.DASHBOARD} className="button button--primary">
        {LABELS.BACK_TO_DASHBOARD}
      </Link>
    </section>
  );
}

export default AccessDeniedPage;
