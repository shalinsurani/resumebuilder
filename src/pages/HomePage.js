
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page pro-home-bg">
      <Header />
      <main className="home-main">
        {/* Hero Section */}
        <section className="home-hero-section">
          <div className="home-hero-container">
            <div className="home-hero-content">
              <h1 className="home-hero-title">Create Your Perfect Resume in Minutes</h1>
              <p className="home-hero-subtitle">Build professional resumes with our modern resume builder. Choose from multiple templates, add your information, and export as PDF.</p>
              <div className="home-hero-actions">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="primary" size="large">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button variant="primary" size="large">Get Started Free</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="secondary" size="large">Sign In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="home-hero-image">
              <div className="home-resume-mockup">
                <div className="home-mockup-header">
                  <div className="home-mockup-dots"><span></span><span></span><span></span></div>
                </div>
                <div className="home-mockup-content">
                  <div className="home-mockup-line long"></div>
                  <div className="home-mockup-line medium"></div>
                  <div className="home-mockup-line short"></div>
                  <div className="home-mockup-section">
                    <div className="home-mockup-line medium"></div>
                    <div className="home-mockup-line long"></div>
                    <div className="home-mockup-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="home-features-section">
          <div className="home-features-container">
            <h2 className="home-section-title">Why Choose Our AI Resume Builder?</h2>
            <div className="home-features-grid">
              <div className="home-feature-card">
                <div className="home-feature-icon"><i className="fas fa-palette"></i></div>
                <h3 className="home-feature-title">Professional Templates</h3>
                <p className="home-feature-description">Choose from modern, classic, and creative templates designed by professionals.</p>
              </div>
              <div className="home-feature-card">
                <div className="home-feature-icon"><i className="fas fa-eye"></i></div>
                <h3 className="home-feature-title">Real-time Preview</h3>
                <p className="home-feature-description">See your resume update instantly as you fill out your information.</p>
              </div>
              <div className="home-feature-card">
                <div className="home-feature-icon"><i className="fas fa-cloud"></i></div>
                <h3 className="home-feature-title">Cloud Storage</h3>
                <p className="home-feature-description">Your resume data is safely stored in the cloud and accessible from anywhere.</p>
              </div>
              <div className="home-feature-card">
                <div className="home-feature-icon"><i className="fas fa-file-pdf"></i></div>
                <h3 className="home-feature-title">PDF Export</h3>
                <p className="home-feature-description">Download your resume as a high-quality PDF ready for job applications.</p>
              </div>
              <div className="home-feature-card">
                <div className="home-feature-icon"><i className="fas fa-mobile-alt"></i></div>
                <h3 className="home-feature-title">Mobile Friendly</h3>
                <p className="home-feature-description">Build and edit your resume on any device with our responsive design.</p>
              </div>
              <div className="home-feature-card">
                <div className="home-feature-icon"><i className="fas fa-camera"></i></div>
                <h3 className="home-feature-title">Photo Upload</h3>
                <p className="home-feature-description">Add your professional photo to make your resume stand out.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="home-how-section">
          <div className="home-how-container">
            <h2 className="home-section-title">How It Works</h2>
            <div className="home-steps-grid">
              <div className="home-step-card">
                <div className="home-step-number">1</div>
                <h3 className="home-step-title">Create Account</h3>
                <p className="home-step-description">Sign up for free and access our AI Resume builder platform.</p>
              </div>
              <div className="home-step-card">
                <div className="home-step-number">2</div>
                <h3 className="home-step-title">Fill Your Information</h3>
                <p className="home-step-description">Add your personal details, work experience, education, and skills.</p>
              </div>
              <div className="home-step-card">
                <div className="home-step-number">3</div>
                <h3 className="home-step-title">Choose Template</h3>
                <p className="home-step-description">Select from our collection of professional resume templates.</p>
              </div>
              <div className="home-step-card">
                <div className="home-step-number">4</div>
                <h3 className="home-step-title">Download & Apply</h3>
                <p className="home-step-description">Export your resume as PDF and start applying for jobs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="home-cta-section">
          <div className="home-cta-container">
            <div className="home-cta-content">
              <h2 className="home-cta-title">Ready to Build Your Resume?</h2>
              <p className="home-cta-description">Join thousands of job seekers who have successfully created their resumes with our platform.</p>
              {!user && (
                <div className="home-cta-actions">
                  <Link to="/signup">
                    <Button variant="primary" size="large">Start Building Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
