import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* Company's Banner Section */}
        <div className="footer-section company-banner">
          <div className="banner-content">
            <img 
              src="/src/components/logo.jpg" 
              alt="SynergySphere Logo" 
              className="footer-logo"
            />
          </div>
        </div>

        {/* Important Information Section */}
        <div className="footer-section important-info">
          <h3>Important Information</h3>
          <div className="info-lines">
            <p>Some important information to be mentioned here</p>
            <p>Additional details about our services and policies</p>
            <p>Contact information and business hours</p>
          </div>
        </div>

        {/* Useful Links Section */}
        <div className="footer-section useful-links">
          <h3>Useful Links</h3>
          <div className="links-lines">
            <p>Quick access to frequently used resources</p>
            <p>Support documentation and help center</p>
            <p>Community forums and user guides</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 Web of the Project. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
