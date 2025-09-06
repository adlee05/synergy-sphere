import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>SynergySphere</h1>
          <div className="header-actions">
            <div className="user-info">
              <FaUser className="user-icon" />
              <span>Welcome, {user?.firstName || user?.email}</span>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to SynergySphere</h2>
            <p>Your Advanced Team Collaboration Platform</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Projects</h3>
              <p>Manage your team projects and track progress</p>
              <button className="card-button">View Projects</button>
            </div>

            <div className="dashboard-card">
              <h3>Team Members</h3>
              <p>Connect and collaborate with your team</p>
              <button className="card-button">Manage Team</button>
            </div>

            <div className="dashboard-card">
              <h3>Messages</h3>
              <p>Communicate with your team members</p>
              <button className="card-button">Open Messages</button>
            </div>

            <div className="dashboard-card">
              <h3>Analytics</h3>
              <p>Track team performance and insights</p>
              <button className="card-button">View Analytics</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
