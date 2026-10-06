import { Link } from 'react-router';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROUTE_ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { hasRole } from '@/utils/hasRole';

function DashboardPage() {
  const { user } = useAuth();
  // Hiding the link is UX, NOT security; the API enforces who may read donor data.
  const canViewDonors = hasRole(user, ROUTE_ROLES.DONORS);

  return (
    <section className="page">
      <PageHeader title={LABELS.DASHBOARD_TITLE} />
      <Card title={`${LABELS.WELCOME}, ${user.fullName}`} titleAs="h2" isWide>
        <p>
          {LABELS.YOUR_ROLE} <span className="badge">{ROLE_LABELS[user.role]}</span>
        </p>
        <p>{ROLE_DESCRIPTIONS[user.role]}</p>
        {canViewDonors && (
          <Link to={ROUTES.DONORS} className="button button--primary">
            {LABELS.GO_TO_DONORS}
          </Link>
        )}
      </Card>
    </section>
  );
}

export default DashboardPage;
