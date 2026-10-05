import { Link } from 'react-router';
import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';

function AccessDeniedPage() {
  return (
    <Card title={LABELS.ACCESS_DENIED_TITLE}>
      <p>{LABELS.ACCESS_DENIED_TEXT}</p>
      <Link to={ROUTES.DASHBOARD} className="button button--primary">
        {LABELS.BACK_TO_DASHBOARD}
      </Link>
    </Card>
  );
}

export default AccessDeniedPage;
