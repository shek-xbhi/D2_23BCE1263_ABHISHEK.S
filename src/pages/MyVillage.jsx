import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import IssueCard from '../components/IssueCard';
import { MapPin, Users, FileText } from 'lucide-react';

const MyVillage = () => {
  const { user } = useAuth();
  const { issues } = useApp();

  const villageIssues = useMemo(() => {
    if (!user?.location?.village) return [];
    return issues
      .filter(i => i.location.village === user.location.village)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [issues, user]);

  const panchayatIssues = useMemo(() => {
    if (!user?.location?.panchayat) return [];
    return issues
      .filter(i => i.location.panchayat === user.location.panchayat && i.location.village !== user.location.village)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [issues, user]);

  return (
    <div className="my-village-page">
      <div className="page-header">
        <div>
          <h1><MapPin size={24} /> My Village Issues</h1>
          <p>Issues in {user?.location?.village || 'your village'} & {user?.location?.panchayat || 'your panchayat'}</p>
        </div>
      </div>

      {/* Village stats */}
      <div className="village-stats">
        <div className="village-stat">
          <FileText size={20} />
          <span className="village-stat-value">{villageIssues.length}</span>
          <span className="village-stat-label">Village Issues</span>
        </div>
        <div className="village-stat">
          <Users size={20} />
          <span className="village-stat-value">{panchayatIssues.length}</span>
          <span className="village-stat-label">Other Panchayat Issues</span>
        </div>
      </div>

      {/* Village issues */}
      <div className="section-header">
        <h2>📍 {user?.location?.village || 'Village'} Issues</h2>
      </div>
      {villageIssues.length === 0 ? (
        <div className="empty-state small">
          <p>No issues reported in your village yet</p>
        </div>
      ) : (
        <div className="issues-grid">
          {villageIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {/* Panchayat issues */}
      {panchayatIssues.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: '2rem' }}>
            <h2>🏘️ Other {user?.location?.panchayat} Issues</h2>
          </div>
          <div className="issues-grid">
            {panchayatIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyVillage;
