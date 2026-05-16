import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TurfList from './pages/TurfList';
import TurfDetail from './pages/TurfDetail';
import MatchList from './pages/MatchList';
import MatchDetail from './pages/MatchDetail';
import CreateMatch from './pages/CreateMatch';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/turfs" element={<TurfList />} />
          <Route path="/turfs/:id" element={<TurfDetail />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          
          {/* Protected Routes */}
          <Route
            path="/create-match"
            element={
              <ProtectedRoute>
                <CreateMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
