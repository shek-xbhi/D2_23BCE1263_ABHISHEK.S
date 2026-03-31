import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import STORAGE_KEYS, { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEYS.USER, null));
  const [isAuthenticated, setIsAuthenticated] = useState(!!loadFromStorage(STORAGE_KEYS.USER));

  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEYS.USER, user);
      setIsAuthenticated(true);
    }
  }, [user]);

  const login = (email, password, role) => {
    // Mock authentication - find user by role or create one
    let foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser) {
      // Create a mock user based on role
      foundUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    }

    setUser(foundUser);
    saveToStorage(STORAGE_KEYS.USER, foundUser);
    return foundUser;
  };

  const signup = (userData) => {
    const newUser = {
      id: 'user_' + Date.now(),
      name: userData.name,
      role: userData.role || 'villager',
      email: userData.email,
      phone: userData.phone || '',
      location: userData.location || {
        state: 'Tamil Nadu',
        district: 'Chengalpattu',
        block: 'Tambaram',
        panchayat: 'Sembakkam Panchayat',
        village: 'Sembakkam',
      },
      stats: { reported: 0, validated: 0 },
    };
    setUser(newUser);
    saveToStorage(STORAGE_KEYS.USER, newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearStorage();
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    saveToStorage(STORAGE_KEYS.USER, updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser,
      isAuthority: user?.role === 'panchayat_authority' || user?.role === 'district_authority',
      isPanchayatAuthority: user?.role === 'panchayat_authority',
      isDistrictAuthority: user?.role === 'district_authority',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
