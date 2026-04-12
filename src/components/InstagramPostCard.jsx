import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, User, ArrowBigUp, ArrowBigDown, ShieldCheck } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import toast from 'react-hot-toast';

const InstagramPostCard = ({ issue }) => {
  const navigate = useNavigate();
  const { validateIssue, hasValidated } = useApp();
  const { user } = useAuth();
  
  const isUpvoted = hasValidated(issue.id, user?.id);
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

  const handleUpvote = () => {
    if (!isUpvoted) {
      validateIssue(issue.id, user?.id);
    }
  };

  const handleDownvote = () => {
    toast.error('Civic actions cannot be downvoted. Report abuse via settings.', {
        style: { background: '#7f1d1d', color: '#fef2f2' },
      });
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
      <div className="insta-post-image" onDoubleClick={handleUpvote}>
        <img src={issue.image} alt={issue.title} loading="lazy" />
      </div>

      {/* Action Bar (Reddit Karma + IG Actions) */}
      <div className="insta-post-actions" style={{ paddingBottom: '0.25rem' }}>
        <div className="insta-post-actions-left" style={{ gap: '1rem' }}>
          
          {/* Trust Score Element */}
          <div className="reddit-karma-widget" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: '20px', padding: '2px 8px' }}>
            <button className="icon-btn" style={{ color: isUpvoted ? '#075e54' : 'currentColor' }} onClick={handleUpvote}>
              <ArrowBigUp size={24} fill={isUpvoted ? '#075e54' : 'none'} />
            </button>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', width: '30px', textAlign: 'center' }}>
              {issue.validations}
            </span>
            <button className="icon-btn" style={{ color: 'currentColor' }} onClick={handleDownvote}>
              <ArrowBigDown size={24} fill="none" />
            </button>
          </div>

          <button className="icon-btn" onClick={() => navigate(`/issue/${issue.id}`)}>
            <MessageCircle size={24} />
          </button>
          <button className="icon-btn">
            <Send size={24} />
          </button>
        </div>
      </div>

      {/* Trust Score Badge */}
      <div className="insta-post-likes" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <ShieldCheck size={16} color="#075e54" /> 
        <span>Community Trust Score: {issue.validations}</span>
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
