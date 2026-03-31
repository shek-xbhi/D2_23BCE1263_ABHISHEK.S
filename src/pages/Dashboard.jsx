import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import FilterBar from '../components/FilterBar';
import { topValidators, topReporters } from '../data/mockData';
import { STATUSES, STATUS_CONFIG } from '../utils/statusUtils';
import {
  AlertTriangle, CheckCircle2, Clock, TrendingUp, Users,
  FileText, Trophy, Award, Star, MapPin, ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { issues, stats } = useApp();
  const { user, isAuthority } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: '',
    status: '',
    location: '',
  });
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  const filteredIssues = useMemo(() => {
    let filtered = [...issues];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.village.toLowerCase().includes(q) ||
        i.location.panchayat.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category) {
      filtered = filtered.filter(i => i.category === filters.category);
    }

    // Status
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }

    // Sort
    if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => b.validations - a.validations);
    }

    return filtered;
  }, [issues, filters, sort]);

  const statCards = [
    { label: 'Total Issues', value: stats.total, icon: FileText, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { label: 'Reported', value: stats.reported, icon: AlertTriangle, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
    { label: 'Under Review', value: stats.underReview, icon: Clock, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' },
    { label: 'Escalated', value: stats.escalated, icon: TrendingUp, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d946ef)' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome header */}
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
          <p>Serving {user?.location?.village || 'your community'} • {user?.location?.district || ''} District</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Massive Report a Problem Button for Villagers */}
      {!isAuthority && (
        <div className="villager-action-card" style={{
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          padding: '2rem',
          borderRadius: '16px',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(29, 78, 216, 0.25)',
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Make Your Voice Heard</h2>
            <p style={{ opacity: 0.9, fontSize: '1rem', maxWidth: '500px' }}>
              Have you noticed any issues like broken roads, water shortage, or garbage accumulation in your village?
              Report it immediately to the local panchayat.
            </p>
          </div>
          <button 
            onClick={() => navigate('/report')}
            style={{
              background: '#ea580c',
              color: '#fff',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            <AlertTriangle size={24} />
            Report a Problem
            <ArrowUpRight size={20} />
          </button>
        </div>
      )}

      {/* Stats cards (Authorities Only) */}
      {isAuthority && (
        <div className="stats-grid">
          {statCards.map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-card-icon" style={{ background: stat.gradient }}>
                <stat.icon size={22} color="#fff" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-value">{stat.value}</span>
                <span className="stat-card-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main content grid */}
      <div className="dashboard-grid">
        {/* Issues section */}
        <div className="dashboard-main">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="issues-count">
            Showing <strong>{filteredIssues.length}</strong> of {issues.length} issues
          </div>

          {filteredIssues.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No issues found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="issues-grid">
              {filteredIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Leaderboard & Quick Stats */}
        <div className="dashboard-sidebar">
          {/* Leaderboard */}
          <div className="leaderboard-card">
            <div className="leaderboard-header">
              <Trophy size={18} />
              <h3>Top Validators</h3>
            </div>
            <div className="leaderboard-list">
              {topValidators.map((v, idx) => (
                <div key={idx} className="leaderboard-item">
                  <span className="leaderboard-rank">{v.badge}</span>
                  <div className="leaderboard-info">
                    <span className="leaderboard-name">{v.name}</span>
                    <span className="leaderboard-village">
                      <MapPin size={11} /> {v.village}
                    </span>
                  </div>
                  <span className="leaderboard-score">{v.validations}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="leaderboard-card">
            <div className="leaderboard-header">
              <Award size={18} />
              <h3>Active Reporters</h3>
            </div>
            <div className="leaderboard-list">
              {topReporters.map((r, idx) => (
                <div key={idx} className="leaderboard-item">
                  <span className="leaderboard-rank">{r.badge}</span>
                  <div className="leaderboard-info">
                    <span className="leaderboard-name">{r.name}</span>
                    <span className="leaderboard-village">
                      <MapPin size={11} /> {r.village}
                    </span>
                  </div>
                  <span className="leaderboard-score">{r.issues}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status distribution */}
          <div className="status-overview-card">
            <h3>Status Distribution</h3>
            <div className="status-bars">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const count = issues.filter(i => i.status === key).length;
                const pct = issues.length > 0 ? (count / issues.length * 100) : 0;
                return (
                  <div key={key} className="status-bar-row">
                    <div className="status-bar-label">
                      <span className="status-dot-mini" style={{ backgroundColor: config.color }} />
                      <span>{config.label}</span>
                    </div>
                    <div className="status-bar-track">
                      <div
                        className="status-bar-fill"
                        style={{ width: `${pct}%`, backgroundColor: config.color }}
                      />
                    </div>
                    <span className="status-bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
