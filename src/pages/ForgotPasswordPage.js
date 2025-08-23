import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ForgotPassword from '../components/auth/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <Header />

      <main className="main-content">
        <div className="auth-container">
          <div className="auth-content">
            <div className="auth-info">
              <h1>Reset Your Password</h1>
              <p>Enter your email address and we'll send you a link to reset your password</p>
              <div className="auth-features">
                <div className="feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure password reset process</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-envelope"></i>
                  <span>Email verification required</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-clock"></i>
                  <span>Reset link expires in 1 hour</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-lock"></i>
                  <span>Your account remains secure</span>
                </div>
              </div>
              
              <div className="auth-help">
                <h3>Need Help?</h3>
                <p>If you don't receive the email within a few minutes, please:</p>
                <ul>
                  <li>Check your spam/junk folder</li>
                  <li>Verify you entered the correct email address</li>
                  <li>Try again with a different email if you have multiple accounts</li>
                </ul>
              </div>
            </div>

            <div className="auth-form-container">
              <ForgotPassword />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
