import { Route, Routes } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { ROUTES } from '@/constants/routes';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import RegisterPage from '@/pages/RegisterPage';

// All routes are nested in PageLayout, so every page gets the same Header and Footer.
function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
