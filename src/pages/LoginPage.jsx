import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocationSelector from '../components/LocationSelector';
import { Eye, User, Mail, Phone, Shield, UserCheck, Building2, ChevronRight, Lock } from 'lucide-react';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'villager',
    location: {},
  });
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      if (!formData.name || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      if (!formData.location.village) {
        setError('Please select your complete location');
        return;
      }
      signup(formData);
    } else {
      if (!formData.email) {
        setError('Please enter your email');
        return;
      }
      login(formData.email, formData.password, formData.role);
    }
    navigate('/');
  };

  const quickLogin = (role) => {
    const roleMap = {
      villager: { email: 'ramesh@gram.in', role: 'villager' },
      panchayat_authority: { email: 'murugan@panchayat.gov.in', role: 'panchayat_authority' },
      district_authority: { email: 'lakshmi@district.gov.in', role: 'district_authority' },
    };
    const creds = roleMap[role];
    login(creds.email, 'demo', creds.role);
    navigate('/');
  };

  const roles = [
    { value: 'villager', label: 'Villager / Citizen', icon: User, desc: 'Report and validate issues' },
    { value: 'panchayat_authority', label: 'Panchayat Authority', icon: Shield, desc: 'Review panchayat issues' },
    { value: 'district_authority', label: 'District Authority', icon: Building2, desc: 'Handle escalated issues' },
  ];

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-pattern" />
      </div>

      <div className="login-container">
        <div className="login-hero">
          <div className="login-hero-content">
            <div className="login-logo">
              <Eye size={40} />
              <h1>GramWatch</h1>
            </div>
            <h2>Community-Driven Rural Governance</h2>
            <p>
              Empowering India's villages through transparent grievance reporting,
              community validation, and accountable governance — from Panchayat to District.
            </p>
            <div className="login-features">
              <div className="login-feature">
                <span className="login-feature-icon">📋</span>
                <span>Report a Problem</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">✅</span>
                <span>Support Reports</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">⬆️</span>
                <span>Auto Escalation</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">🏛️</span>
                <span>Authority Tracking</span>
              </div>
            </div>

            {/* Quick login section */}
            <div className="quick-login">
              <h4>Quick Demo Login</h4>
              <div className="quick-login-btns">
                <button onClick={() => quickLogin('villager')} className="quick-btn villager">
                  <User size={16} />
                  Login as Villager
                </button>
                <button onClick={() => quickLogin('panchayat_authority')} className="quick-btn panchayat">
                  <Shield size={16} />
                  Login as Panchayat Authority
                </button>
                <button onClick={() => quickLogin('district_authority')} className="quick-btn district">
                  <Building2 size={16} />
                  Login as District Authority
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-form-card">
            <div className="login-form-header">
              <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p>{isSignup ? 'Join GramWatch and make a difference' : 'Sign in to continue to GramWatch'}</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="form-group">
                  <label><User size={14} /> Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
              )}

              <div className="form-group">
                <label><Mail size={14} /> Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              {isSignup && (
                <div className="form-group">
                  <label><Phone size={14} /> Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              )}

              <div className="form-group">
                <label><Lock size={14} /> Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  {roles.map(role => (
                    <button
                      key={role.value}
                      type="button"
                      className={`role-option ${formData.role === role.value ? 'active' : ''}`}
                      onClick={() => setFormData(p => ({ ...p, role: role.value }))}
                    >
                      <role.icon size={18} />
                      <span className="role-label">{role.label}</span>
                      <span className="role-desc">{role.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isSignup && (
                <LocationSelector
                  value={formData.location}
                  onChange={(loc) => setFormData(p => ({ ...p, location: loc }))}
                  compact
                />
              )}

              <button type="submit" className="login-submit-btn">
                {isSignup ? 'Create Account' : 'Sign In'}
                <ChevronRight size={18} />
              </button>
            </form>

            <div className="login-toggle">
              <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
              <button onClick={() => { setIsSignup(!isSignup); setError(''); }}>
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
