import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, MapPin } from 'lucide-react';

const Explore = () => {
  const navigate = useNavigate();
  const { issues } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Randomize or sort issues for explore (just all issues for now)
  const exploreIssues = useMemo(() => {
    let filtered = [...issues];
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(q) ||
        i.location.district.toLowerCase().includes(q) ||
        i.location.state.toLowerCase().includes(q)
      );
    }

    // Sort by recent or shuffle
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtered;
  }, [issues, searchTerm]);

  return (
    <div className="insta-explore-page">
      <div className="insta-explore-header">
        <div className="search-bar-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search problems, districts, states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="insta-explore-grid">
        {exploreIssues.map(issue => (
          <div 
            key={issue.id} 
            className="explore-grid-item"
            onClick={() => navigate(`/issue/${issue.id}`)}
          >
            <img src={issue.image} alt={issue.title} loading="lazy" />
            <div className="explore-grid-overlay">
               <div className="overlay-info">
                 <MapPin size={16} />
                 <span>{issue.location.district}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
