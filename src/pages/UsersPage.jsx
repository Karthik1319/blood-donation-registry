import { useState } from 'react';
import AsyncContent from '@/components/ui/AsyncContent';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { BREADCRUMBS } from '@/constants/navigation';
import ChangeRoleDialog from '@/features/users/ChangeRoleDialog';
import ChangeStatusDialog from '@/features/users/ChangeStatusDialog';
import UserTable from '@/features/users/UserTable';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { getUsers } from '@/services/userService';

// Admin-only page (see ROUTE_ROLES.USERS); the API enforces the same rule. getUsers takes no
// inputs, so it can be passed to useFetch directly without useCallback.
function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error, reload } = useFetch(getUsers);
  const [roleTarget, setRoleTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const users = data ?? [];

  const closeDialogs = () => {
    setRoleTarget(null);
    setStatusTarget(null);
  };

  const handleDone = () => {
    closeDialogs();
    reload();
  };

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
        <UserTable
          users={users}
          currentUserId={currentUser.id}
          onChangeRole={setRoleTarget}
          onChangeStatus={setStatusTarget}
        />
      </AsyncContent>
      {roleTarget && (
        <ChangeRoleDialog user={roleTarget} onCancel={closeDialogs} onDone={handleDone} />
      )}
      {statusTarget && (
        <ChangeStatusDialog user={statusTarget} onCancel={closeDialogs} onDone={handleDone} />
      )}
    </section>
  );
}

export default UsersPage;
