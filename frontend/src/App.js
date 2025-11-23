import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import RegisterOrg from './pages/RegisterOrg';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Layout Component with Navigation
const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <h2>HRMS</h2>
          </div>
          <div className="nav-links">
            <Link to="/employees">Employees</Link>
            <Link to="/teams">Teams</Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrg />} />
        
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout>
                <Employees />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Layout>
                <Teams />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/employees" />} />
      </Routes>
    </Router>
  );
}

export default App;
