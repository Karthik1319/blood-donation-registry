import { BrowserRouter, Route, Routes } from 'react-router';
import { LABELS } from '@/constants/labels';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import { ROUTE_ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import AuthProvider from '@/context/AuthProvider';
import GuestRoute from '@/features/auth/GuestRoute';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import RoleRoute from '@/features/auth/RoleRoute';
import DashboardPage from '@/pages/DashboardPage';
import ToastProvider from '@/context/ToastProvider';
import DonationFormPage from '@/pages/DonationFormPage';
import DonorDetailsPage from '@/pages/DonorDetailsPage';
import DonorFormPage from '@/pages/DonorFormPage';
import DonorListPage from '@/pages/DonorListPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import StatusPage from '@/pages/StatusPage';
import UsersPage from '@/pages/UsersPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Logged-out pages: simple header + footer. */}
            <Route element={<PublicLayout />}>
              <Route element={<GuestRoute />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              </Route>
            </Route>
            {/* Logged-in pages: sidebar + topbar. */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route element={<RoleRoute allowedRoles={ROUTE_ROLES.DONORS} />}>
                  <Route path={ROUTES.DONORS} element={<DonorListPage />} />
                  <Route path={ROUTES.DONOR_DETAILS} element={<DonorDetailsPage />} />
                </Route>
                <Route element={<RoleRoute allowedRoles={ROUTE_ROLES.DONOR_FORM} />}>
                  {/* Same page for both: an :id in the URL means edit mode. */}
                  <Route path={ROUTES.DONOR_NEW} element={<DonorFormPage />} />
                  <Route path={ROUTES.DONOR_EDIT} element={<DonorFormPage />} />
                </Route>
                <Route element={<RoleRoute allowedRoles={ROUTE_ROLES.DONATION_FORM} />}>
                  {/* Same page for both: a :donationId in the URL means edit mode. */}
                  <Route path={ROUTES.DONATION_NEW} element={<DonationFormPage />} />
                  <Route path={ROUTES.DONATION_EDIT} element={<DonationFormPage />} />
                </Route>
                <Route element={<RoleRoute allowedRoles={ROUTE_ROLES.USERS} />}>
                  <Route path={ROUTES.USERS} element={<UsersPage />} />
                </Route>
                {/* Unknown address: logged-out users are sent to Login first by ProtectedRoute. */}
                <Route
                  path="*"
                  element={
                    <StatusPage title={LABELS.NOT_FOUND_TITLE} message={LABELS.NOT_FOUND_TEXT} />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
