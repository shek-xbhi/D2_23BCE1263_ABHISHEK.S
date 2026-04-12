import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, User } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import StatusBadge from './StatusBadge';

const InstagramPostCard = ({ issue }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const category = getCategoryById(issue.category);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} h`;
    if (days === 1) return '1 d';
    if (days < 7) return `${days} d`;
    return `${Math.floor(days / 7)} w`;
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="insta-post-card">
      {/* Header */}
      <div className="insta-post-header">
        <div className="insta-post-user">
          <div className="insta-post-avatar">
            <User size={16} />
          </div>
          <div className="insta-post-user-info">
            <span className="insta-post-username">
              Villager_{issue.id.slice(-4)}
            </span>
            <span className="insta-post-location">
              {issue.location.village}, {issue.location.panchayat}
            </span>
          </div>
        </div>
        <div className="insta-post-options">
          <StatusBadge status={issue.status} size="small" />
          <button className="icon-btn"><MoreHorizontal size={20} /></button>
        </div>
      </div>

      {/* Image */}
      <div className="insta-post-image" onDoubleClick={handleLike}>
        <img src={issue.image} alt={issue.title} loading="lazy" />
      </div>

      {/* Action Bar */}
      <div className="insta-post-actions">
        <div className="insta-post-actions-left">
          <button className={`icon-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <Heart size={24} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "currentColor"} />
          </button>
          <button className="icon-btn" onClick={() => navigate(`/issue/${issue.id}`)}>
            <MessageCircle size={24} />
          </button>
          <button className="icon-btn">
            <Send size={24} />
          </button>
        </div>
        <div className="insta-post-actions-right">
          <button className="icon-btn">
            <Bookmark size={24} />
          </button>
        </div>
      </div>

      {/* Likes / Validations */}
      <div className="insta-post-likes">
        {issue.validations + (liked ? 1 : 0)} validations
      </div>

      {/* Caption */}
      <div className="insta-post-caption">
        <span className="insta-post-caption-user">Villager_{issue.id.slice(-4)}</span>
        {' '}
        <span className="insta-post-title-text">{issue.title}</span>
        <p className="insta-post-desc-text">{issue.description}</p>
        <div className="insta-post-tags">
          <span className="insta-tag">#{category?.label.replace(/\s+/g, '') || 'Issue'}</span>
          <span className="insta-tag">#{issue.location.village.replace(/\s+/g, '')}</span>
        </div>
      </div>

      {/* Comments link */}
      <div 
        className="insta-post-comments-link"
        onClick={() => navigate(`/issue/${issue.id}`)}
      >
        View all updates and comments
      </div>

      {/* Timestamp */}
      <div className="insta-post-time">
        {timeAgo(issue.createdAt)}
      </div>
    </div>
  );
};

export default InstagramPostCard;
