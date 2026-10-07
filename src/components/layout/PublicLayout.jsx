import { Outlet } from 'react-router';
import Footer from '@/components/layout/Footer';
import PageErrorBoundary from '@/components/layout/PageErrorBoundary';
import PublicHeader from '@/components/layout/PublicHeader';

/** Frame for logged-out pages (Login, Register): simple header, the page, footer. */
function PublicLayout() {
  return (
    <div className="layout">
      <PublicHeader />
      <main className="layout__main">
        <PageErrorBoundary>
          <Outlet />
        </PageErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
