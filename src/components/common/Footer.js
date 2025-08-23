
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>AI Resume Builder</h4>
            <p style={{color:"#FFFFFF"}}>Create professional resumes with ease using our modern resume builder.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Multiple Templates</li>
              <li>Real-time Preview</li>
              <li>PDF Export</li>
              <li>Cloud Storage</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{color:"#FFFFFF"}}> &copy; 2025 AI Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
