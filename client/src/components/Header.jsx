import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="main-header">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="nav-title">
            <div className="logo-container">
              <img 
                src="/src/components/logo.jpg" 
                alt="SynergySphere Logo" 
                className="logo-image"
              />
            </div>
          </div>
          
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/login" 
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
