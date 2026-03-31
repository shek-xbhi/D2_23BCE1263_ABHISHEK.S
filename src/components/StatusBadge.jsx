import { getStatusConfig } from '../utils/statusUtils';

const StatusBadge = ({ status, size = 'normal' }) => {
  const config = getStatusConfig(status);
  
  return (
    <span
      className={`status-badge status-badge-${size}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      <span className="status-dot" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
