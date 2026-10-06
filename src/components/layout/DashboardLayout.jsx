import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { LABELS } from '@/constants/labels';

const SIDEBAR_ID = 'app-sidebar';

/** Frame for every logged-in page: Sidebar on the left, Topbar on top, the page below it. */
function DashboardLayout() {
  // Only matters on small screens; on desktop CSS always shows the sidebar.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isSidebarOpen]);

  return (
    <div className="dashboard">
      <Sidebar id={SIDEBAR_ID} isOpen={isSidebarOpen} onNavigate={closeSidebar} />
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label={LABELS.CLOSE_MENU}
          onClick={closeSidebar}
        />
      )}
      <div className="dashboard__main">
        <Topbar
          sidebarId={SIDEBAR_ID}
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="dashboard__content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
