import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import PageLayout from '@/components/layout/PageLayout';
import { ROUTE_ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import AuthProvider from '@/context/AuthProvider';
import GuestRoute from '@/features/auth/GuestRoute';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import RoleRoute from '@/features/auth/RoleRoute';
import DashboardPage from '@/pages/DashboardPage';
import DonorListPage from '@/pages/DonorListPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Every route inside PageLayout gets the shared Header and Footer. */}
          <Route element={<PageLayout />}>
            <Route element={<GuestRoute />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route element={<RoleRoute allowedRoles={ROUTE_ROLES.DONORS} />}>
                <Route path={ROUTES.DONORS} element={<DonorListPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
