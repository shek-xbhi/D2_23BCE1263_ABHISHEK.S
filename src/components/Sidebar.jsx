import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Home, Compass, PlusCircle, FileText, Shield, MapPin,
  Bell, LogOut, ChevronLeft, ChevronRight, Menu, X, User,
  Building2, Eye
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout, isAuthority, isPanchayatAuthority, isDistrictAuthority } = useAuth();
  const { stats } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/report', label: 'Report a Problem', icon: PlusCircle },
    { path: '/my-issues', label: 'My Issues', icon: FileText },
    { path: '/my-village', label: 'My Village', icon: MapPin },
  ];

  if (isAuthority) {
    navItems.push({ path: '/authority', label: 'Authority Panel', icon: Shield });
  }

  const getRoleBadge = () => {
    if (isDistrictAuthority) return { label: 'District Authority', color: '#8b5cf6' };
    if (isPanchayatAuthority) return { label: 'Panchayat Authority', color: '#f59e0b' };
    return { label: 'Villager', color: '#22c55e' };
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Eye size={collapsed ? 20 : 24} />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <h1>GramWatch</h1>
              <span>Rural Governance</span>
            </div>
          )}
          <button className="sidebar-close-mobile" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User card */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <User size={collapsed ? 16 : 20} />
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user?.name || 'Guest'}</span>
              <span className="user-role" style={{ color: roleBadge.color }}>
                {roleBadge.label}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.path === '/' && stats.unreadNotifications > 0 && (
                <span className="nav-badge">{stats.unreadNotifications}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Stats summary */}
        {!collapsed && (
          <div className="sidebar-stats">
            <div className="stat-mini">
              <span className="stat-mini-value">{stats.total}</span>
              <span className="stat-mini-label">Total Issues</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value" style={{ color: '#22c55e' }}>{stats.resolved}</span>
              <span className="stat-mini-label">Resolved</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-value" style={{ color: '#f59e0b' }}>{stats.escalated}</span>
              <span className="stat-mini-label">Escalated</span>
            </div>
          </div>
        )}

        {/* Location */}
        {!collapsed && user?.location && (
          <div className="sidebar-location">
            <MapPin size={14} />
            <span>{user.location.village}, {user.location.district}</span>
          </div>
        )}

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
