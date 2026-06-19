import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import DepartmentUserMapping from './components/DepartmentUserMapping';
import Login from './components/Login';
import RtiQueryList from './components/RtiQueryList';

const ROLE_ROUTES = {
  admin: '/admin',
  deptAdmin: '/dept-admin',
  user: '/dashboard',
};

function ProtectedRoute({ currentRole, allowedRole, children }) {
  if (!currentRole) return <Navigate to="/login" replace />;
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={ROLE_ROUTES[currentRole]} replace />;
  }
  return children;
}

export default function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const navigate = useNavigate();

  function handleLogin(role) {
    setCurrentRole(role);
    navigate(ROLE_ROUTES[role]);
  }

  function handleLogout() {
    setCurrentRole(null);
    navigate('/login');
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentRole ? (
            <Navigate to={ROLE_ROUTES[currentRole]} replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute currentRole={currentRole} allowedRole="admin">
            <AppLayout currentRole={currentRole} onLogout={handleLogout}>
              <Dashboard currentRole={currentRole} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dept-admin"
        element={
          <ProtectedRoute currentRole={currentRole} allowedRole="deptAdmin">
            <AppLayout currentRole={currentRole} onLogout={handleLogout}>
              <Dashboard currentRole={currentRole} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dept-admin/masters"
        element={
          <ProtectedRoute currentRole={currentRole} allowedRole="deptAdmin">
            <AppLayout currentRole={currentRole} onLogout={handleLogout}>
              <DepartmentUserMapping />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute currentRole={currentRole} allowedRole="user">
            <AppLayout currentRole={currentRole} onLogout={handleLogout}>
              <Dashboard currentRole={currentRole} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/rti-queries"
        element={
          <ProtectedRoute currentRole={currentRole} allowedRole="user">
            <AppLayout currentRole={currentRole} onLogout={handleLogout}>
              <RtiQueryList />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
