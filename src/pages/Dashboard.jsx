import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import InstagramPostCard from '../components/InstagramPostCard';
import { AlertTriangle, PlusSquare } from 'lucide-react';
import { api } from '../utils/api';

const SkeletonCard = () => (
  <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }}>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0' }} />
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
         <div style={{ width: '40%', height: '14px', background: '#e2e8f0', borderRadius: '4px' }} />
         <div style={{ width: '20%', height: '10px', background: '#e2e8f0', borderRadius: '4px' }} />
       </div>
    </div>
    <div style={{ width: '100%', height: '200px', background: '#e2e8f0', borderRadius: '8px' }} />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { issues } = useApp();
  const { user, isAuthority } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate rural network fetch on mount
  useEffect(() => {
    const fetchFeed = async () => {
      await api.get('/feed_sync');
      setIsLoading(false);
    };
    fetchFeed();
  }, []);
  
  // Smart Sorting Algorithm
  const localIssues = useMemo(() => {
    let filtered = [...issues];
    
    if (user?.location?.village) {
      filtered = filtered.filter(i => i.location.district === user?.location?.district);
    }

    const urgentCategories = ['health', 'water', 'electricity', 'safety'];

    const scoredIssues = filtered.map(issue => {
      let urgencyLevel = urgentCategories.includes(issue.category) ? 100 : 50;
      
      // Strict algorithm: (Validations * 0.6) + (UrgencyLevel * 0.4)
      // I am mapping literal validations integer.
      const relevanceScore = (issue.validations * 0.6) + (urgencyLevel * 0.4);

      return { ...issue, relevanceScore };
    });

    scoredIssues.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scoredIssues;
  }, [issues, user]);

  // Instagram Stories Mock (Recent Resolutions)
  const recentResolutions = useMemo(() => {
    return issues.filter(i => i.status === 'resolved').slice(0, 8);
  }, [issues]);

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
        {/* Instagram Stories Header (Recent Resolutions) */}
        {recentResolutions.length > 0 && (
          <div className="insta-stories-container">
            <h3 className="stories-title">Recent Resolutions</h3>
            <div className="insta-stories-scroll">
              {recentResolutions.map(res => (
                <div key={res.id} className="story-item" onClick={() => navigate(`/issue/${res.id}`)}>
                  <div className="story-ring">
                    <img src={res.image} alt={res.location.village} className="story-img" />
                  </div>
                  <span className="story-label">{res.location.village}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="skeleton-feed">
             <SkeletonCard />
             <SkeletonCard />
             <SkeletonCard />
          </div>
        ) : localIssues.length === 0 ? (
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
