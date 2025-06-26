import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderManagement from './pages/ProviderManagement';
import Book from './pages/Book';
import UserBookings from './pages/UserBookings';
import ServiceDescription from './pages/ServiceDescription';
import './styles.css';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/provider"
                  element={
                    <ProtectedRoute allowedRole="provider">
                      <ProviderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="/book" element={<Book />} />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute allowedRole="client">
                      <UserBookings />
                    </ProtectedRoute>
                  }
                />
                <Route path="/service/:id" element={<ServiceDescription />} />
                <Route path="*" element={<div className="text-center mt-8">404 - Page Not Found</div>} />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
      </FilterProvider>
    </AuthProvider>
  );
}

export default App;