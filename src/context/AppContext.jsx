import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockIssues } from '../data/mockData';
import { getStatusFromValidations, STATUSES, STATUS_CONFIG } from '../utils/statusUtils';
import STORAGE_KEYS, { saveToStorage, loadFromStorage } from '../utils/storage';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [issues, setIssues] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.ISSUES);
    return stored || mockIssues;
  });
  
  const [notifications, setNotifications] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  });

  const [validationMap, setValidationMap] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.VALIDATIONS, {});
  });

  // Persist data
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ISSUES, issues);
  }, [issues]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VALIDATIONS, validationMap);
  }, [validationMap]);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    
    // Show toast
    const emoji = notification.type === 'validation' ? '✅' : 
                  notification.type === 'escalation' ? '⚡' :
                  notification.type === 'status' ? '📋' : '🔔';
    toast(notification.message, {
      icon: emoji,
      duration: 4000,
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      },
    });
  }, []);

  const addIssue = useCallback((issueData) => {
    const newIssue = {
      id: Math.random().toString(36).substr(2, 9),
      ...issueData,
      validations: 0,
      validatedBy: [],
      status: STATUSES.REPORTED,
      currentAuthority: 'Community',
      remarks: '',
      timeline: [
        {
          status: STATUSES.REPORTED,
          timestamp: new Date().toISOString(),
          note: `Issue reported by ${issueData.reporterName}`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setIssues(prev => [newIssue, ...prev]);
    addNotification({
      type: 'status',
      message: `New issue reported: "${issueData.title}"`,
      issueId: newIssue.id,
    });
    
    return newIssue;
  }, [addNotification]);

  const validateIssue = useCallback((issueId, userId) => {
    // Check if user already validated
    const key = `${issueId}_${userId}`;
    if (validationMap[key]) {
      toast.error('You have already validated this issue', {
        style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(239, 68, 68, 0.3)' },
      });
      return false;
    }

    setValidationMap(prev => ({ ...prev, [key]: true }));

    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      
      const newValidations = issue.validations + 1;
      const newStatus = getStatusFromValidations(newValidations);
      const statusChanged = newStatus !== issue.status && 
        issue.status !== STATUSES.UNDER_REVIEW && 
        issue.status !== STATUSES.RESOLVED;
      
      const updatedIssue = {
        ...issue,
        validations: newValidations,
        validatedBy: [...issue.validatedBy, userId],
        updatedAt: new Date().toISOString(),
      };

      if (statusChanged) {
        updatedIssue.status = newStatus;
        updatedIssue.currentAuthority = STATUS_CONFIG[newStatus].authority;
        updatedIssue.timeline = [
          ...issue.timeline,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: `Status updated: ${STATUS_CONFIG[newStatus].label} (${newValidations} validations)`,
          },
        ];

        // Notification
        addNotification({
          type: newStatus.includes('escalated') ? 'escalation' : 'validation',
          message: `"${issue.title}" → ${STATUS_CONFIG[newStatus].label}`,
          issueId: issue.id,
        });
      }

      return updatedIssue;
    }));

    toast.success('Issue validated successfully!', {
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(34, 197, 94, 0.3)' },
    });
    return true;
  }, [validationMap, addNotification]);

  const updateIssueStatus = useCallback((issueId, newStatus, remarks = '') => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      
      const updatedIssue = {
        ...issue,
        status: newStatus,
        currentAuthority: STATUS_CONFIG[newStatus]?.authority || issue.currentAuthority,
        remarks: remarks || issue.remarks,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...issue.timeline,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: `Authority updated status: ${STATUS_CONFIG[newStatus]?.label}${remarks ? '. Remarks: ' + remarks : ''}`,
          },
        ],
      };

      addNotification({
        type: 'status',
        message: `"${issue.title}" updated to ${STATUS_CONFIG[newStatus]?.label}`,
        issueId: issue.id,
      });

      return updatedIssue;
    }));
  }, [addNotification]);

  const escalateToDistrict = useCallback((issueId) => {
    updateIssueStatus(issueId, STATUSES.ESCALATED_DISTRICT, 'Panchayat unable to resolve. Escalated to District Authority.');
    addNotification({
      type: 'escalation',
      message: 'Issue escalated to District Authority',
      issueId,
    });
  }, [updateIssueStatus, addNotification]);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const hasValidated = useCallback((issueId, userId) => {
    return !!validationMap[`${issueId}_${userId}`];
  }, [validationMap]);

  const getIssueById = useCallback((id) => {
    return issues.find(issue => issue.id === id);
  }, [issues]);

  const getIssuesByLocation = useCallback((locationField, value) => {
    return issues.filter(issue => issue.location[locationField] === value);
  }, [issues]);

  const getIssuesByStatus = useCallback((status) => {
    return issues.filter(issue => issue.status === status);
  }, [issues]);

  const stats = {
    total: issues.length,
    reported: issues.filter(i => i.status === STATUSES.REPORTED).length,
    validated: issues.filter(i => i.status === STATUSES.VALIDATED).length,
    escalated: issues.filter(i => 
      i.status === STATUSES.ESCALATED_PANCHAYAT || 
      i.status === STATUSES.ESCALATED_DISTRICT
    ).length,
    underReview: issues.filter(i => i.status === STATUSES.UNDER_REVIEW).length,
    resolved: issues.filter(i => i.status === STATUSES.RESOLVED).length,
    unreadNotifications: notifications.filter(n => !n.read).length,
  };

  return (
    <AppContext.Provider value={{
      issues,
      notifications,
      stats,
      addIssue,
      validateIssue,
      updateIssueStatus,
      escalateToDistrict,
      hasValidated,
      getIssueById,
      getIssuesByLocation,
      getIssuesByStatus,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
