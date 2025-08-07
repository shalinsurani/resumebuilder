
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SignUp from '../components/auth/SignUp';

const SignUpPage = () => {
  return (
    <div className="auth-page">
      <Header />

      <main className="main-content">
        <div className="auth-container">
          <div className="auth-content">
            <div className="auth-info">
              {/* <h1>Join Resume Builder</h1>
              <p>Create your professional resume in minutes with our easy-to-use builder</p>
              <div className="auth-features">
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Free to get started</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Multiple template options</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Cloud storage included</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>Mobile-friendly design</span>
                </div> */}
              {/* </div> */}
            </div>

            <div className="auth-form-container">
              <SignUp />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUpPage;
