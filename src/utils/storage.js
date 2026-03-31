const STORAGE_KEYS = {
  ISSUES: 'gramwatch_issues',
  USER: 'gramwatch_user',
  VALIDATIONS: 'gramwatch_validations',
  NOTIFICATIONS: 'gramwatch_notifications',
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
};

export const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};

export default STORAGE_KEYS;
