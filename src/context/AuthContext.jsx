import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import STORAGE_KEYS, { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage';
import { apiService } from '../utils/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Mock JWT Generator
const generateMockJWT = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ 
    sub: user.id, 
    role: user.role, 
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  const mockSignature = btoa("mock_signature_defense_grade");
  return `${header}.${payload}.${mockSignature}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEYS.USER, null));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Validate Token on Mount (Middleware Simulation)
  useEffect(() => {
    const validateSession = async () => {
      const storedUser = loadFromStorage(STORAGE_KEYS.USER, null);
      const token = sessionStorage.getItem('gw_jwt_token');

      if (storedUser && token) {
        try {
          // Decode payload to check expiration
          const payloadStr = atob(token.split('.')[1]);
          const payload = JSON.parse(payloadStr);
          
          if (payload.exp > Math.floor(Date.now() / 1000)) {
            // Simulate network latency for token check
            await apiService.get({ valid: true });
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            throw new Error("Token expired");
          }
        } catch (e) {
          console.warn("Auth Middleware: Invalid or expired token. Forcing logout.");
          logout();
        }
      }
      setIsAuthLoading(false);
    };

    validateSession();
  }, []);

  const login = async (email, password, role) => {
    setIsAuthLoading(true);
    
    // Simulate network authentication request
    await apiService.post({ email, role });

    let foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser) {
      foundUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    }

    // Generate JWT and store in Session Storage (More secure than local storage for tokens)
    const token = generateMockJWT(foundUser);
    sessionStorage.setItem('gw_jwt_token', token);

    setUser(foundUser);
    saveToStorage(STORAGE_KEYS.USER, foundUser);
    setIsAuthenticated(true);
    setIsAuthLoading(false);
    return foundUser;
  };

  const signup = async (userData) => {
    setIsAuthLoading(true);
    await apiService.post(userData);

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

    const token = generateMockJWT(newUser);
    sessionStorage.setItem('gw_jwt_token', token);

    setUser(newUser);
    saveToStorage(STORAGE_KEYS.USER, newUser);
    setIsAuthenticated(true);
    setIsAuthLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearStorage();
    sessionStorage.removeItem('gw_jwt_token');
  };

  const updateUser = async (updates) => {
    await apiService.patch(updates);
    const updated = { ...user, ...updates };
    setUser(updated);
    saveToStorage(STORAGE_KEYS.USER, updated);
  };

  // Auth Middleware Function (can be used directly in components)
  const requireAuthMiddleware = () => {
    if (!sessionStorage.getItem('gw_jwt_token')) {
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAuthLoading,
      login,
      signup,
      logout,
      updateUser,
      requireAuthMiddleware,
      isAuthority: user?.role === 'panchayat_authority' || user?.role === 'district_authority',
      isPanchayatAuthority: user?.role === 'panchayat_authority',
      isDistrictAuthority: user?.role === 'district_authority',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
