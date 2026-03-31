import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Bell, Menu, Search, Check, CheckCheck, X } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { notifications, stats, markNotificationRead, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <form className="header-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-right">
        <div className="notification-wrapper" ref={notifRef}>
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {stats.unreadNotifications > 0 && (
              <span className="notification-count">{stats.unreadNotifications}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                {stats.unreadNotifications > 0 && (
                  <button onClick={markAllNotificationsRead} className="mark-all-read">
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifications.slice(0, 15).map(notif => (
                    <div
                      key={notif.id}
                      className={`notif-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.issueId) {
                          navigate(`/issue/${notif.issueId}`);
                          setShowNotifications(false);
                        }
                      }}
                    >
                      <div className="notif-dot" />
                      <div className="notif-content">
                        <p>{notif.message}</p>
                        <span className="notif-time">{formatTime(notif.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-user-info">
          <span className="header-greeting">
            {user?.location?.village && `📍 ${user.location.village}`}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
