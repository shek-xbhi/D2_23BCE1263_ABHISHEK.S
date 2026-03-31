import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { STATUSES, STATUS_CONFIG } from '../utils/statusUtils';
import {
  Shield, Building2, Clock, Users, MapPin, AlertTriangle,
  CheckCircle2, Eye, ChevronRight, MessageSquare, TrendingUp,
  Filter
} from 'lucide-react';

const AuthorityPanel = () => {
  const { user, isPanchayatAuthority, isDistrictAuthority } = useAuth();
  const { issues, updateIssueStatus, escalateToDistrict } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [remarkText, setRemarkText] = useState('');
  const [activeRemarkId, setActiveRemarkId] = useState(null);

  // Filter issues based on authority role
  const authorityIssues = useMemo(() => {
    let filtered;

    if (isDistrictAuthority) {
      // Show escalated issues from the district
      filtered = issues.filter(i =>
        i.location.district === user?.location?.district &&
        (i.status === STATUSES.ESCALATED_DISTRICT ||
         i.status === STATUSES.ESCALATED_PANCHAYAT ||
         i.status === STATUSES.UNDER_REVIEW ||
         i.status === STATUSES.RESOLVED)
      );
    } else if (isPanchayatAuthority) {
      // Show issues from their panchayat
      filtered = issues.filter(i =>
        i.location.panchayat === user?.location?.panchayat
      );
    } else {
      filtered = [];
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    // Sort by priority (validations) then recency
    filtered.sort((a, b) => {
      if (a.status === STATUSES.RESOLVED && b.status !== STATUSES.RESOLVED) return 1;
      if (b.status === STATUSES.RESOLVED && a.status !== STATUSES.RESOLVED) return -1;
      return b.validations - a.validations;
    });

    return filtered;
  }, [issues, user, isPanchayatAuthority, isDistrictAuthority, statusFilter]);

  const handleStatusUpdate = (issueId, newStatus) => {
    const remark = activeRemarkId === issueId ? remarkText : '';
    updateIssueStatus(issueId, newStatus, remark);
    setRemarkText('');
    setActiveRemarkId(null);
  };

  const getPriorityLevel = (issue) => {
    if (issue.validations >= 13) return { label: 'Critical', color: '#ef4444' };
    if (issue.validations >= 9) return { label: 'High', color: '#f97316' };
    if (issue.validations >= 6) return { label: 'Medium', color: '#f59e0b' };
    return { label: 'Low', color: '#22c55e' };
  };

  const daysPending = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / 86400000);
  };

  const summaryStats = {
    total: authorityIssues.length,
    pending: authorityIssues.filter(i => i.status !== STATUSES.RESOLVED).length,
    underReview: authorityIssues.filter(i => i.status === STATUSES.UNDER_REVIEW).length,
    resolved: authorityIssues.filter(i => i.status === STATUSES.RESOLVED).length,
    critical: authorityIssues.filter(i => i.validations >= 13).length,
  };

  return (
    <div className="authority-page">
      <div className="page-header">
        <div>
          <h1>
            {isDistrictAuthority ? (
              <><Building2 size={24} /> District Authority Panel</>
            ) : (
              <><Shield size={24} /> Panchayat Authority Panel</>
            )}
          </h1>
          <p>
            {isDistrictAuthority
              ? `Managing escalated issues for ${user?.location?.district} District`
              : `Managing issues for ${user?.location?.panchayat}`
            }
          </p>
        </div>
      </div>

      {/* Authority Stats */}
      <div className="authority-stats">
        <div className="auth-stat-card">
          <div className="auth-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <AlertTriangle size={20} color="#fff" />
          </div>
          <div>
            <span className="auth-stat-value">{summaryStats.pending}</span>
            <span className="auth-stat-label">Pending</span>
          </div>
        </div>
        <div className="auth-stat-card">
          <div className="auth-stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
            <Eye size={20} color="#fff" />
          </div>
          <div>
            <span className="auth-stat-value">{summaryStats.underReview}</span>
            <span className="auth-stat-label">Under Review</span>
          </div>
        </div>
        <div className="auth-stat-card">
          <div className="auth-stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
            <CheckCircle2 size={20} color="#fff" />
          </div>
          <div>
            <span className="auth-stat-value">{summaryStats.resolved}</span>
            <span className="auth-stat-label">Resolved</span>
          </div>
        </div>
        <div className="auth-stat-card">
          <div className="auth-stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
            <TrendingUp size={20} color="#fff" />
          </div>
          <div>
            <span className="auth-stat-value">{summaryStats.critical}</span>
            <span className="auth-stat-label">Critical</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="authority-filter">
        <Filter size={16} />
        <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All ({summaryStats.total})</button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = authorityIssues.filter(i => i.status === key).length;
          if (count === 0 && statusFilter !== key) return null;
          return (
            <button
              key={key}
              className={statusFilter === key ? 'active' : ''}
              onClick={() => setStatusFilter(key)}
              style={statusFilter === key ? { borderColor: config.color, color: config.color } : {}}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Issues list */}
      <div className="authority-issues">
        {authorityIssues.length === 0 ? (
          <div className="empty-state">
            <Shield size={48} />
            <h3>No issues to review</h3>
            <p>All caught up! No pending issues for your jurisdiction.</p>
          </div>
        ) : (
          authorityIssues.map(issue => {
            const priority = getPriorityLevel(issue);
            const pending = daysPending(issue.createdAt);
            const isResolved = issue.status === STATUSES.RESOLVED;

            return (
              <div key={issue.id} className={`authority-issue-card ${isResolved ? 'resolved' : ''}`}>
                <div className="auth-issue-header">
                  <div className="auth-issue-priority" style={{ backgroundColor: priority.color }}>
                    {priority.label}
                  </div>
                  <StatusBadge status={issue.status} size="small" />
                </div>

                <div className="auth-issue-body" onClick={() => navigate(`/issue/${issue.id}`)}>
                  <div className="auth-issue-image">
                    <img src={issue.image} alt={issue.title} />
                  </div>
                  <div className="auth-issue-info">
                    <h3>{issue.title}</h3>
                    <p>{issue.description.slice(0, 120)}...</p>
                    <div className="auth-issue-meta">
                      <span><MapPin size={13} /> {issue.location.village}, {issue.location.panchayat}</span>
                      <span><Users size={13} /> {issue.validations} validations</span>
                      <span><Clock size={13} /> {pending} days pending</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="auth-issue-arrow" />
                </div>

                {/* Action buttons */}
                {!isResolved && (
                  <div className="auth-issue-actions">
                    {/* Remark input */}
                    {activeRemarkId === issue.id && (
                      <div className="remark-input">
                        <MessageSquare size={14} />
                        <input
                          type="text"
                          placeholder="Add remarks..."
                          value={remarkText}
                          onChange={(e) => setRemarkText(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="auth-action-btns">
                      <button
                        className="remark-toggle"
                        onClick={() => setActiveRemarkId(activeRemarkId === issue.id ? null : issue.id)}
                      >
                        <MessageSquare size={14} />
                        Remarks
                      </button>
                      {issue.status !== STATUSES.UNDER_REVIEW && (
                        <button
                          className="auth-action-btn review"
                          onClick={() => handleStatusUpdate(issue.id, STATUSES.UNDER_REVIEW)}
                        >
                          <Eye size={14} />
                          Mark Under Review
                        </button>
                      )}
                      <button
                        className="auth-action-btn resolve"
                        onClick={() => handleStatusUpdate(issue.id, STATUSES.RESOLVED)}
                      >
                        <CheckCircle2 size={14} />
                        Resolve
                      </button>
                      {isPanchayatAuthority && issue.status !== STATUSES.ESCALATED_DISTRICT && (
                        <button
                          className="auth-action-btn escalate"
                          onClick={() => escalateToDistrict(issue.id)}
                        >
                          <TrendingUp size={14} />
                          Escalate to District
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {issue.remarks && (
                  <div className="auth-issue-remarks">
                    <MessageSquare size={13} />
                    <span>{issue.remarks}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AuthorityPanel;
