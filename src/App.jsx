import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import IssueDetail from './pages/IssueDetail';
import MyIssues from './pages/MyIssues';
import MyVillage from './pages/MyVillage';
import AuthorityPanel from './pages/AuthorityPanel';
import Explore from './pages/Explore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthorityRoute = ({ children }) => {
  const { isAuthenticated, isAuthority, requireAuthMiddleware } = useAuth();
  if (!isAuthenticated || !requireAuthMiddleware()) return <Navigate to="/login" replace />;
  if (!isAuthority) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/issue/:id" element={<IssueDetail />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/my-village" element={<MyVillage />} />
        <Route
          path="/authority"
          element={
            <AuthorityRoute>
              <AuthorityPanel />
            </AuthorityRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
