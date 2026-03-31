import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import { getCategoryById } from '../data/categories';
import { STATUS_CONFIG, STATUSES } from '../utils/statusUtils';
import {
  ArrowLeft, MapPin, Users, Shield, Clock, ThumbsUp,
  AlertTriangle, Building2, CheckCircle2, Share2, Flag
} from 'lucide-react';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIssueById, validateIssue, hasValidated, escalateToDistrict } = useApp();
  const { user } = useAuth();

  const issue = getIssueById(id);

  if (!issue) {
    return (
      <div className="empty-state">
        <AlertTriangle size={48} />
        <h3>Issue not found</h3>
        <p>The issue you're looking for doesn't exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  const category = getCategoryById(issue.category);
  const CategoryIcon = category?.icon;
  const alreadyValidated = hasValidated(issue.id, user?.id);
  const statusConfig = STATUS_CONFIG[issue.status];

  const handleValidate = () => {
    validateIssue(issue.id, user?.id);
  };

  const handleEscalate = () => {
    escalateToDistrict(issue.id);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const canEscalate = user?.role === 'panchayat_authority' && 
    issue.status !== STATUSES.ESCALATED_DISTRICT && 
    issue.status !== STATUSES.RESOLVED;

  return (
    <div className="issue-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="issue-detail-grid">
        {/* Main content */}
        <div className="issue-detail-main">
          {/* Image */}
          <div className="issue-detail-image">
            <img src={issue.image} alt={issue.title} />
            <div className="issue-detail-category" style={{ backgroundColor: category?.color }}>
              {CategoryIcon && <CategoryIcon size={16} />}
              {category?.label}
            </div>
          </div>

          {/* Title & Meta */}
          <div className="issue-detail-header">
            <h1>{issue.title}</h1>
            <div className="issue-detail-meta">
              <StatusBadge status={issue.status} />
              <span className="meta-divider" />
              <span className="meta-item">
                <Clock size={14} />
                Reported on {formatDate(issue.createdAt)}
              </span>
              <span className="meta-item">
                <Users size={14} />
                {issue.reporterName}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="issue-detail-section">
            <h2>Description</h2>
            <p className="issue-description-text">{issue.description}</p>
          </div>

          {/* Location */}
          <div className="issue-detail-section">
            <h2><MapPin size={18} /> Location Details</h2>
            <div className="location-hierarchy">
              <div className="location-chain">
                <span className="loc-item">{issue.location.village}</span>
                <span className="loc-arrow">→</span>
                <span className="loc-item">{issue.location.panchayat}</span>
                <span className="loc-arrow">→</span>
                <span className="loc-item">{issue.location.block}</span>
                <span className="loc-arrow">→</span>
                <span className="loc-item">{issue.location.district}</span>
                <span className="loc-arrow">→</span>
                <span className="loc-item">{issue.location.state}</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {issue.remarks && (
            <div className="issue-detail-section remarks-section">
              <h2><Flag size={18} /> Authority Remarks</h2>
              <div className="remarks-box">
                <p>{issue.remarks}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="issue-detail-section">
            <Timeline timeline={issue.timeline} currentStatus={issue.status} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="issue-detail-sidebar">
          {/* Validation card */}
          <div className="validation-card">
            <div className="validation-header">
              <Users size={20} />
              <h3>Community Support</h3>
            </div>
            <div className="validation-count-big">
              <span className="validation-number">{issue.validations}</span>
              <span className="validation-text">supporters</span>
            </div>
            <div className="validation-progress">
              <div className="validation-bar">
                <div
                  className="validation-bar-fill"
                  style={{
                    width: `${Math.min(100, (issue.validations / 13) * 100)}%`,
                    background: `linear-gradient(90deg, ${statusConfig?.color || '#6366f1'}, ${statusConfig?.color || '#8b5cf6'}80)`,
                  }}
                />
              </div>
              <div className="validation-thresholds">
                <span className={issue.validations >= 3 ? 'reached' : ''}>3 Supported</span>
                <span className={issue.validations >= 6 ? 'reached' : ''}>6 Panchayat</span>
                <span className={issue.validations >= 9 ? 'reached' : ''}>9 Escalated</span>
                <span className={issue.validations >= 13 ? 'reached' : ''}>13+ District</span>
              </div>
            </div>

            {issue.status !== STATUSES.RESOLVED ? (
              <button
                className={`validate-btn ${alreadyValidated ? 'validated' : ''}`}
                onClick={handleValidate}
                disabled={alreadyValidated}
              >
                {alreadyValidated ? (
                  <>
                    <CheckCircle2 size={18} />
                    Already Supported
                  </>
                ) : (
                  <>
                    <ThumbsUp size={18} />
                    Support This Report
                  </>
                )}
              </button>
            ) : (
              <div className="resolved-badge">
                <CheckCircle2 size={22} />
                <span>This issue has been resolved</span>
              </div>
            )}
          </div>

          {/* Current Authority */}
          <div className="authority-card">
            <div className="authority-header">
              <Shield size={18} />
              <h3>Current Authority</h3>
            </div>
            <div className="authority-info">
              <Building2 size={24} />
              <span>{issue.currentAuthority}</span>
            </div>
            <div className="authority-status">
              <span>Status:</span>
              <StatusBadge status={issue.status} size="small" />
            </div>

            {canEscalate && (
              <button className="escalate-btn" onClick={handleEscalate}>
                <AlertTriangle size={16} />
                Escalate to District
              </button>
            )}
          </div>

          {/* Share */}
          <div className="share-card">
            <button className="share-btn" onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
            }}>
              <Share2 size={16} />
              Copy Issue Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
