import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/loginpage';
import Homepage from './pages/homepage';
import Navbar from './components/navbar';
import FormsPage from './pages/forms';
import OfficerRegistrationForm from './pages/officerforms';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
         <Route path="/officer" element={
          <ProtectedRoute>
            <OfficerRegistrationForm />
          </ProtectedRoute>
        } />
          <Route path="/forms" element={
          <ProtectedRoute>
            <FormsPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

// Public Route Component (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default App;