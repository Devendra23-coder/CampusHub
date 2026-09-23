import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import StudentLayout from './components/common/StudentLayout';
import AdminLayout from './components/common/AdminLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import Events from './pages/student/Events';
import EventDetail from './pages/student/EventDetail';
import MyEvents from './pages/student/MyEvents';
import Clubs from './pages/student/Clubs';
import Announcements from './pages/student/Announcements';
import Profile from './pages/student/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import EventRegistrations from './pages/admin/EventRegistrations';
import ManageClubs from './pages/admin/ManageClubs';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Student Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><StudentLayout><Dashboard /></StudentLayout></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><StudentLayout><Events /></StudentLayout></ProtectedRoute>} />
      <Route path="/events/:id" element={<ProtectedRoute><StudentLayout><EventDetail /></StudentLayout></ProtectedRoute>} />
      <Route path="/my-events" element={<ProtectedRoute><StudentLayout><MyEvents /></StudentLayout></ProtectedRoute>} />
      <Route path="/clubs" element={<ProtectedRoute><StudentLayout><Clubs /></StudentLayout></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><StudentLayout><Announcements /></StudentLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><StudentLayout><Profile /></StudentLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/events" element={<AdminRoute><AdminLayout><ManageEvents /></AdminLayout></AdminRoute>} />
      <Route path="/admin/events/:id/registrations" element={<AdminRoute><AdminLayout><EventRegistrations /></AdminLayout></AdminRoute>} />
      <Route path="/admin/clubs" element={<AdminRoute><AdminLayout><ManageClubs /></AdminLayout></AdminRoute>} />
      <Route path="/admin/announcements" element={<AdminRoute><AdminLayout><ManageAnnouncements /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminLayout><ManageUsers /></AdminLayout></AdminRoute>} />
    </Routes>
  );
}

export default App;
