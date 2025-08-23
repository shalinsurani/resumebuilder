
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getResumes, removeResume, loading, error } = useFirestore();
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadResumes();
  }, []);

  // Reload resumes when user returns to dashboard
  useEffect(() => {
    const handleFocus = () => {
      console.log('Dashboard: Window focused, reloading resumes'); // Debug log
      loadResumes();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadResumes = async () => {
    console.log('Dashboard: loadResumes called'); // Debug log
    console.log('Dashboard: Current user:', user); // Debug log
    setLoadingResumes(true);
    try {
      const result = await getResumes();
      console.log('Dashboard: getResumes result:', result); // Debug log
      console.log('Dashboard: Number of resumes found:', result.data?.length || 0); // Debug log
      if (result.success) {
        console.log('Dashboard: Setting resumes:', result.data); // Debug log
        console.log('Dashboard: Resume details:', result.data.map(r => ({ id: r.id, title: r.title, fullName: r.personalInfo?.fullName })));
        setResumes(result.data);
      } else {
        console.error('Dashboard: Error loading resumes:', result.error);
      }
    } catch (error) {
      console.error('Dashboard: Error loading resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const result = await removeResume(resumeId);
        if (result.success) {
          setResumes(resumes.filter(resume => resume.id !== resumeId));
        } else {
          alert('Error deleting resume: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting resume: ' + error.message);
      }
    }
  };

  const handleEditResume = (resumeId) => {
    navigate(`/resume-builder?id=${resumeId}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-page pro-dashboard-bg">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <section className="dashboard-topbar">
            <div className="dashboard-welcome">
              <h1 className="dashboard-title">Welcome back, <span className="dashboard-user">{user?.displayName || user?.email}</span>!</h1>
              <p className="dashboard-subtitle">Manage your resumes and create new ones</p>
            </div>
            <div className="dashboard-create-btn">
              <Link to="/resume-builder?new=true">
                <Button variant="primary" size="large">
                  <i className="fas fa-plus"></i> Create New Resume
                </Button>
              </Link>
              {/* <Button
                variant="secondary"
                size="large"
                onClick={loadResumes}
                style={{marginLeft: '10px'}}
              >
                <i className="fas fa-refresh"></i> Refresh
              </Button> */}

            </div>
          </section>

          <section className="dashboard-content-area">
            <div className="dashboard-resumes-area">
              <h2 className="dashboard-section-title">Your Resumes</h2>
              {loadingResumes ? (
                <div className="dashboard-loading-card">
                  <LoadingSpinner size="large" />
                  <p>Loading your resumes...</p>
                </div>
              ) : error ? (
                <div className="dashboard-error-card">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>Error loading resumes: {error}</p>
                  <Button variant="secondary" onClick={loadResumes}>Try Again</Button>
                </div>
              ) : resumes.length === 0 ? (
                <div className="dashboard-empty-card">
                  <div className="dashboard-empty-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h3>No resumes yet</h3>
                  <p>Create your first resume to get started</p>
                  <Link to="/resume-builder?new=true">
                    <Button variant="primary">Create Your First Resume</Button>
                  </Link>
                </div>
              ) : (
                <div className="dashboard-resumes-grid">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="dashboard-resume-card">
                      <div className="dashboard-resume-preview">
                        <div className="dashboard-preview-header">
                          <div className="dashboard-preview-line long"></div>
                          <div className="dashboard-preview-line medium"></div>
                        </div>
                        <div className="dashboard-preview-content">
                          <div className="dashboard-preview-line short"></div>
                          <div className="dashboard-preview-line medium"></div>
                          <div className="dashboard-preview-line long"></div>
                          <div className="dashboard-preview-line short"></div>
                        </div>
                      </div>
                      <div className="dashboard-resume-info">
                        <h3 className="dashboard-resume-title">{resume.title || resume.personalInfo?.fullName || 'Untitled Resume'}</h3>
                        <div className="dashboard-resume-meta">
                          <span className="dashboard-template-badge">{resume.template || 'modern'}</span>
                          <span className="dashboard-last-updated">Updated {formatDate(resume.lastUpdated)}</span>
                        </div>
                        <div className="dashboard-resume-actions">
                          <Button variant="primary" size="small" onClick={() => handleEditResume(resume.id)}>
                            <i className="fas fa-edit"></i> Edit
                          </Button>
                          {/* <Button variant="secondary" size="small" onClick={() => { console.log('Preview resume:', resume.id); }}>
                            <i className="fas fa-eye"></i> Preview
                          </Button> */}
                          <Button variant="danger" size="small" onClick={() => handleDeleteResume(resume.id)} disabled={loading}>
                            <i className="fas fa-trash"></i> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="dashboard-sidebar-area">
              <div className="dashboard-stats-card">
                <h3 className="dashboard-card-title">Your Stats</h3>
                <div className="dashboard-stat-item">
                  <span className="dashboard-stat-label">Total Resumes</span>
                  <span className="dashboard-stat-value">{resumes.length}</span>
                </div>
                <div className="dashboard-stat-item">
                  <span className="dashboard-stat-label">Templates Used</span>
                  <span className="dashboard-stat-value">{new Set(resumes.map(r => r.template)).size}</span>
                </div>
              </div>
              <div className="dashboard-tips-card">
                <h3 className="dashboard-card-title">Resume Tips</h3>
                <ul className="dashboard-tips-list">
                  <li>Keep your resume to 1-2 pages</li>
                  <li>Use action verbs to describe your experience</li>
                  <li>Quantify your achievements with numbers</li>
                  <li>Tailor your resume for each job application</li>
                  <li>Proofread carefully for spelling and grammar</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
