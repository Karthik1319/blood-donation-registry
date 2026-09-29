import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

// Shared frame for every page; <Outlet /> is where React Router renders the current page.
function PageLayout() {
  return (
    <div className="layout">
      <Header />
      <main id="main-content" className="layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PageLayout;
