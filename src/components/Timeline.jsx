import { getStatusConfig, STATUSES } from '../utils/statusUtils';
import { CheckCircle2, Circle, ArrowDown } from 'lucide-react';

const TIMELINE_STEPS = [
  { status: STATUSES.REPORTED, label: 'Reported by Community' },
  { status: STATUSES.VALIDATED, label: 'Validated by Community' },
  { status: STATUSES.PANCHAYAT_REVIEW, label: 'Sent to Panchayat' },
  { status: STATUSES.ESCALATED_PANCHAYAT, label: 'Escalated to Panchayat' },
  { status: STATUSES.UNDER_REVIEW, label: 'Under Review' },
  { status: STATUSES.ESCALATED_DISTRICT, label: 'Escalated to District' },
  { status: STATUSES.RESOLVED, label: 'Resolved' },
];

const Timeline = ({ timeline = [], currentStatus }) => {
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

  // Find which steps have been completed
  const completedStatuses = new Set(timeline.map(t => t.status));
  
  // Build display items from actual timeline
  const timelineMap = {};
  timeline.forEach(t => {
    timelineMap[t.status] = t;
  });

  return (
    <div className="timeline">
      <h3 className="timeline-title">Issue Timeline</h3>
      <div className="timeline-track">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = completedStatuses.has(step.status);
          const isCurrent = step.status === currentStatus;
          const timelineEntry = timelineMap[step.status];
          const config = getStatusConfig(step.status);

          return (
            <div
              key={step.status}
              className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="timeline-marker">
                <div
                  className="timeline-dot"
                  style={{
                    backgroundColor: isCompleted ? config.color : 'transparent',
                    borderColor: isCompleted ? config.color : 'rgba(148, 163, 184, 0.3)',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} color="#fff" />
                  ) : (
                    <Circle size={16} color="rgba(148, 163, 184, 0.4)" />
                  )}
                </div>
                {index < TIMELINE_STEPS.length - 1 && (
                  <div
                    className="timeline-line"
                    style={{
                      backgroundColor: isCompleted ? config.color : 'rgba(148, 163, 184, 0.15)',
                    }}
                  />
                )}
              </div>
              <div className="timeline-content">
                <span
                  className="timeline-label"
                  style={{ color: isCompleted ? config.color : 'rgba(148, 163, 184, 0.5)' }}
                >
                  {step.label}
                </span>
                {timelineEntry && (
                  <>
                    <span className="timeline-note">{timelineEntry.note}</span>
                    <span className="timeline-date">{formatDate(timelineEntry.timestamp)}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
