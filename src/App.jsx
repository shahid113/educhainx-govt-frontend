import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AddInstituteForm from './components/AddInstituteForm';
import InstituteList from './components/InstituteList';
import ProtectedRoute from './components/ProtectedRoute';
import Statistics from './components/Statistics';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout/>
              </ProtectedRoute>
            }
          >
            {/* Nested Routes inside Dashboard */}
            <Route index element={<Statistics/>} />
            <Route path="add-institute" element={<AddInstituteForm />} />
            <Route path="institutes" element={<InstituteList />} />
          </Route>

          {/* Redirect any other route to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
