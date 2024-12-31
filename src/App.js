import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/loginpage';
import Homepage from './pages/homepage';
import Navbar from './components/navbar';
import FormsPage from './pages/forms';
import OfficerRegistrationForm from './pages/officerforms';
import ErrorBoundary from './errorboundary';

// Public Route Component
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  console.log("PublicRoute accessed, user:", user);
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  console.log("ProtectedRoute accessed, user:", user);
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  try {
    // Just verify it's valid JSON, we don't need to check the structure here
    JSON.parse(user);
  } catch (err) {
    console.error("Invalid user data in localStorage");
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;