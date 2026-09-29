import { Outlet } from 'react-router';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

/** Shared frame for every page: Header on top, the current page in the middle, Footer below. */
function PageLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PageLayout;
