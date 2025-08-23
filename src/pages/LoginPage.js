
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <Header />

      <main className="main-content">
        <div className="auth-container">
          <div className="auth-content">
            <div className="auth-info">
              {/* <h1>Welcome Back!</h1>
              <p>Sign in to continue building your professional resume</p> */}
              {/* <div className="auth-features"> */}
                {/* <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Access your saved resumes</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Real-time preview and editing</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Multiple professional templates</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>PDF export functionality</span>
                </div> */}
              {/* </div> */}
            </div>

            <div className="auth-form-container">
              <Login />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
