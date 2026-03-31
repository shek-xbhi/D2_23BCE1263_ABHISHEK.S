import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="main-content">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
