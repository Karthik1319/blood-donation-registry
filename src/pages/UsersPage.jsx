import AsyncContent from '@/components/ui/AsyncContent';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { BREADCRUMBS } from '@/constants/navigation';
import UserTable from '@/features/users/UserTable';
import { useFetch } from '@/hooks/useFetch';
import { getUsers } from '@/services/userService';

// Admin-only page (see ROUTE_ROLES.USERS). getUsers takes no inputs, so it can be passed to
// useFetch directly without useCallback.
function UsersPage() {
  const { data, isLoading, error, reload } = useFetch(getUsers);
  const users = data ?? [];

  return (
    <section className="page">
      <PageHeader
        title={LABELS.USERS_TITLE}
        subtitle={LABELS.USERS_SUBTITLE}
        breadcrumbs={[BREADCRUMBS.DASHBOARD]}
        breadcrumbLabel={LABELS.BREADCRUMB}
      />
      <AsyncContent
        isLoading={isLoading}
        error={error}
        isEmpty={users.length === 0}
        loadingText={LABELS.LOADING}
        emptyText={LABELS.NO_USERS}
        retryLabel={LABELS.RETRY}
        onRetry={reload}
      >
        <UserTable users={users} />
      </AsyncContent>
    </section>
  );
}

export default UsersPage;
