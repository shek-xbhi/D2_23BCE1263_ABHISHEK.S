import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import InstagramPostCard from '../components/InstagramPostCard';
import { AlertTriangle, PlusSquare } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { issues } = useApp();
  const { user, isAuthority } = useAuth();
  
  // Filter issues to only match user's location (Village or District)
  // Or show everything if user has no location
  const localIssues = useMemo(() => {
    let filtered = [...issues];
    
    if (user?.location?.village) {
      filtered = filtered.filter(i => 
        i.location.village === user.location.village || 
        i.location.district === user.location.district
      );
    }
    
    // Sort by recent
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtered;
  }, [issues, user]);

  return (
    <div className="insta-home-page">
      {/* Top Header area for mobile */}
      <div className="insta-feed-header">
        <h1 className="insta-logo">GramWatch</h1>
        {!isAuthority && (
          <button className="insta-header-action" onClick={() => navigate('/report')}>
            <PlusSquare size={24} />
          </button>
        )}
      </div>

      <div className="insta-feed-container">
        {/* Optional Context Header */}
        <div className="insta-feed-context">
          <h2>Local Feed</h2>
          <p>📍 {user?.location?.village || 'Unknown'}, {user?.location?.district || ''}</p>
        </div>

        {localIssues.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} color="#ccc" />
            <h3 style={{marginTop: '1rem'}}>No local issues found</h3>
            <p>You're all caught up! Explore other locations or report a new issue.</p>
          </div>
        ) : (
          <div className="insta-feed">
            {localIssues.map(issue => (
              <InstagramPostCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
      
      {/* Right side suggestions/profile for Desktop? Keeping it simple with just feed. */}
      <div className="insta-desktop-sidebar">
        <div className="insta-desktop-profile">
           <div className="avatar-circle">{user?.name ? user.name[0] : 'U'}</div>
           <div className="profile-info">
             <strong>{user?.name || 'Villager'}</strong>
             <span>{user?.location?.village || 'Local Area'}</span>
           </div>
        </div>
        
        <div className="suggestions-header">
          <span>Explore India</span>
          <button onClick={() => navigate('/explore')}>See All</button>
        </div>
        <p className="suggestion-desc">Discover what's happening around the nation and validate severe issues in other districts.</p>
      </div>
    </div>
  );
};

export default Dashboard;
