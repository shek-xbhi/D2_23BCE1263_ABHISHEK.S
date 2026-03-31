// Status definitions and transition logic

export const STATUSES = {
  REPORTED: 'reported',
  VALIDATED: 'validated',
  PANCHAYAT_REVIEW: 'panchayat_review',
  ESCALATED_PANCHAYAT: 'escalated_panchayat',
  ESCALATED_DISTRICT: 'escalated_district',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
};

export const STATUS_CONFIG = {
  [STATUSES.REPORTED]: {
    label: 'Reported',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    authority: 'Community',
    order: 1,
  },
  [STATUSES.VALIDATED]: {
    label: 'Community Verified',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    authority: 'Community',
    order: 2,
  },
  [STATUSES.PANCHAYAT_REVIEW]: {
    label: 'Ready for Panchayat',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    authority: 'Panchayat Authority',
    order: 3,
  },
  [STATUSES.ESCALATED_PANCHAYAT]: {
    label: 'Escalated to Panchayat',
    color: '#d946ef',
    bgColor: 'rgba(217, 70, 239, 0.15)',
    borderColor: 'rgba(217, 70, 239, 0.3)',
    authority: 'Panchayat Authority',
    order: 4,
  },
  [STATUSES.ESCALATED_DISTRICT]: {
    label: 'Escalated to District',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    authority: 'District Authority',
    order: 5,
  },
  [STATUSES.UNDER_REVIEW]: {
    label: 'Under Review',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    authority: 'Authority',
    order: 6,
  },
  [STATUSES.RESOLVED]: {
    label: 'Resolved',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    authority: 'Resolved',
    order: 7,
  },
};

export const getStatusFromValidations = (count) => {
  if (count >= 13) return STATUSES.ESCALATED_DISTRICT;
  if (count >= 9) return STATUSES.ESCALATED_PANCHAYAT;
  if (count >= 6) return STATUSES.PANCHAYAT_REVIEW;
  if (count >= 3) return STATUSES.VALIDATED;
  return STATUSES.REPORTED;
};

export const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG[STATUSES.REPORTED];

export const getTimelineSteps = () => [
  { status: STATUSES.REPORTED, label: 'Reported by Community' },
  { status: STATUSES.VALIDATED, label: 'Validated by Community' },
  { status: STATUSES.PANCHAYAT_REVIEW, label: 'Sent to Panchayat' },
  { status: STATUSES.ESCALATED_PANCHAYAT, label: 'Escalated to Panchayat' },
  { status: STATUSES.UNDER_REVIEW, label: 'Under Review by Authority' },
  { status: STATUSES.ESCALATED_DISTRICT, label: 'Escalated to District' },
  { status: STATUSES.RESOLVED, label: 'Issue Resolved' },
];
