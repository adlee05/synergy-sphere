import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaUser, FaEllipsisV, FaSearch, FaPlus } from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('projects');

  const projects = [
    {
      id: 1,
      title: 'RD Services',
      image: '/api/placeholder/300/200',
      date: '21/03/02',
      deadline: 'D-18',
      tasks: 10,
      labels: ['Services', 'Castener Gare'],
      color: 'purple'
    },
    {
      id: 2,
      title: 'RD Sales',
      image: '/api/placeholder/300/200',
      date: '21/03/22',
      deadline: 'D-18',
      tasks: 200,
      labels: ['Help', 'Payment'],
      color: 'purple'
    },
    {
      id: 3,
      title: 'RD Upgrade',
      image: '/api/placeholder/300/200',
      date: '21/03/22',
      deadline: 'D-18',
      tasks: 0,
      labels: ['Upgrade', 'Migration'],
      color: 'blue'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeNav === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveNav('projects')}
          >
            Projects
          </div>
          <div 
            className={`nav-item ${activeNav === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveNav('tasks')}
          >
            My Tasks
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="theme-toggle-container">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
          
          <div className="user-profile">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-info">
              <div className="user-name">Test User</div>
              <div className="user-email">user@mail</div>
            </div>
            <button className="user-menu">
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="company-info">
              <span className="company-name">Company</span>
              <div className="company-icon">🏢</div>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="header-right">
            <button className="header-menu">
              <FaEllipsisV />
            </button>
            <button className="new-project-btn">
              <FaPlus />
              New Project
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-header">
            <h2>Projects</h2>
          </div>
          
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <div className={`project-bg ${project.color}`}></div>
                  <div className="project-labels">
                    {project.labels.map((label, index) => (
                      <span key={index} className="project-label">{label}</span>
                    ))}
                  </div>
                </div>
                
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  
                  <div className="project-meta">
                    <div className="project-date">{project.date}</div>
                    <div className="project-deadline">{project.deadline}</div>
                    <div className="project-tasks">{project.tasks} tasks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
