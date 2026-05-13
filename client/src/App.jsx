import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ThemeToggle from "./components/ThemeToggle";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" />; // Redirect if wrong role
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

           <div className="flex justify-end p-4">
            <ThemeToggle />
            </div>
            
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route 
              path="/teacher/dashboard" 
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">404</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Page not found</p>
              </div>
            } />
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
