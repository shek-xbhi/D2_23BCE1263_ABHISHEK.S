import { getStatusConfig, STATUSES } from '../utils/statusUtils';
import { User, ShieldCheck, ArrowBigUp, ArrowBigDown, MessageSquare } from 'lucide-react';

const Timeline = ({ timeline = [] }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Reddit-Style Comment Thread visualization
  return (
    <div className="reddit-timeline-thread" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare size={18} /> Official Discussion Thread
      </h3>

      {timeline.map((entry, index) => {
        // Logic to mock an Avatar based on the status context
        const isAuthorityAction = 
          entry.status.includes('REVIEW') || 
          entry.status.includes('ESCALATED') || 
          entry.status === 'RESOLVED';
        
        const config = getStatusConfig(entry.status);

        return (
          <div key={index} className="reddit-comment-node" style={{
            display: 'flex', 
            gap: '0.75rem', 
            background: isAuthorityAction ? 'rgba(7, 94, 84, 0.05)' : 'var(--bg-card)',
            borderLeft: isAuthorityAction ? '3px solid var(--accent)' : '3px solid transparent',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)'
          }}>
            {/* Karma simulation on comments */}
            <div className="comment-karma" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                <ArrowBigUp size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{Math.floor(Math.random() * 50) + 1}</span>
                <ArrowBigDown size={20} />
            </div>

            <div className="comment-content" style={{ flex: 1 }}>
              <div className="comment-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: isAuthorityAction ? 'var(--accent)' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  {isAuthorityAction ? <ShieldCheck size={14} /> : <User size={14} />}
                </div>
                <strong style={{ fontSize: '0.9rem', color: isAuthorityAction ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {isAuthorityAction ? 'Official Authority Module' : 'Citizen Network'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {formatDate(entry.timestamp)}</span>
              </div>
              
              <div className="comment-body" style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <p><strong>[{config.label}]</strong> - {entry.note}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
