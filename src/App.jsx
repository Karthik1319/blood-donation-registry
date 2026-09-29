import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import PageLayout from '@/components/layout/PageLayout';
import { ROUTES } from '@/constants/routes';
import AuthProvider from '@/context/AuthProvider';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Every route inside PageLayout gets the shared Header and Footer. */}
          <Route element={<PageLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
