import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getCategoryById } from '../data/categories';

const IssueCard = ({ issue }) => {
  const navigate = useNavigate();
  const category = getCategoryById(issue.category);
  const CategoryIcon = category?.icon;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="issue-card" onClick={() => navigate(`/issue/${issue.id}`)}>
      <div className="issue-card-image">
        <img src={issue.image} alt={issue.title} loading="lazy" />
        <div className="issue-card-category" style={{ backgroundColor: category?.color || '#64748b' }}>
          {CategoryIcon && <CategoryIcon size={14} />}
          <span>{category?.label || 'General'}</span>
        </div>
      </div>
      
      <div className="issue-card-body">
        <h3 className="issue-card-title">{issue.title}</h3>
        <p className="issue-card-desc">{issue.description.slice(0, 100)}...</p>

        <div className="issue-card-location">
          <MapPin size={14} />
          <span>{issue.location.village}, {issue.location.panchayat}</span>
        </div>

        <div className="issue-card-meta">
          <div className="issue-card-validations">
            <Users size={15} />
            <span className="validation-count">{issue.validations}</span>
            <span className="validation-label">validations</span>
          </div>
          <StatusBadge status={issue.status} size="small" />
        </div>

        <div className="issue-card-footer">
          <span className="issue-card-time">
            <Clock size={13} />
            {timeAgo(issue.createdAt)}
          </span>
          <span className="issue-card-view">
            View Details <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
