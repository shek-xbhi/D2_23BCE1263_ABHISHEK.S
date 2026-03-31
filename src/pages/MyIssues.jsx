import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import IssueCard from '../components/IssueCard';
import { FileText, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyIssues = () => {
  const { user } = useAuth();
  const { issues } = useApp();
  const navigate = useNavigate();

  const myIssues = useMemo(() => {
    return issues
      .filter(i => i.reportedBy === user?.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [issues, user]);

  return (
    <div className="my-issues-page">
      <div className="page-header">
        <div>
          <h1>My Reported Issues</h1>
          <p>Track all the issues you have reported to the community</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/report')}>
          <PlusCircle size={18} />
          Report New Issue
        </button>
      </div>

      {myIssues.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No issues reported yet</h3>
          <p>Start contributing to your community by reporting local issues</p>
          <button className="btn-primary" onClick={() => navigate('/report')}>
            <PlusCircle size={18} />
            Report First Issue
          </button>
        </div>
      ) : (
        <div className="issues-grid">
          {myIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssues;
