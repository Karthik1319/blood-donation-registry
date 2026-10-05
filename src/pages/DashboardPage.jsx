import { Link } from 'react-router';
import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { PERMISSIONS, ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/hasPermission';

function DashboardPage() {
  const { user } = useAuth();
  // Hiding the link is UX, NOT security; the API enforces who may read donor data.
  const canViewDonors = hasPermission(user, PERMISSIONS.DONOR_VIEW_ALL);

  return (
    <Card title={`${LABELS.DASHBOARD_TITLE}, ${user.fullName}`}>
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
  );
}

export default DashboardPage;
