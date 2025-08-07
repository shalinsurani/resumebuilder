
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PersonalInfo from '../components/resume/PersonalInfo';
import Summary from '../components/resume/Summary';
import Experience from '../components/resume/Experience';
import Education from '../components/resume/Education';
import Skills from '../components/resume/Skills';
import Projects from '../components/resume/Projects';
import ResumePreview from '../components/resume/ResumePreview';
import { debounce } from '../utils/helpers';
import Certifications from '../components/resume/Certifications';
import AdditionalInfo from '../components/resume/AdditionalInfo';
import { exportResumeToPDF } from '../services/pdfExport';
import { showSuccess, showError, showLoading, notificationService } from '../services/notifications';

import { performAdvancedATSAnalysis } from '../services/advancedATSService';
import AdvancedATSModal from '../components/ats/AdvancedATSModal';
import { performGrammarCheck } from '../services/grammarService';
import GrammarCheckModal from '../components/grammar/GrammarCheckModal';
import { extractTextFromFile, parseResumeText, validateResumeData } from '../services/resumeParsingService';

const ResumeBuilderPage = () => {
  const { user } = useAuth();
  const resumeContext = useResume();
  const { saveResume, loading, dispatch } = resumeContext;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('personal');

  // Check for URL parameter changes and handle accordingly
  useEffect(() => {
    const isNewResume = searchParams.get('new') === 'true';

    if (user && isNewResume) {
      dispatch({ type: 'RESET_RESUME' });
    }
    // The ResumeContext will handle loading the specific resume for resumeId
  }, [searchParams, user, dispatch]);
  const [atsModalOpen, setAtsModalOpen] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [grammarModalOpen, setGrammarModalOpen] = useState(false);
  const [grammarResult, setGrammarResult] = useState(null);
  const [grammarLoading, setGrammarLoading] = useState(false);

  // Advanced ATS check logic
  const handleATSCheck = async () => {
    // Check if there's resume data to analyze
    const hasResumeData = resumeContext.personalInfo?.fullName ||
                         resumeContext.summary ||
                         (resumeContext.experience && resumeContext.experience.length > 0) ||
                         (resumeContext.skills && resumeContext.skills.length > 0);

    if (!hasResumeData) {
      // Open modal in upload mode if no resume data
      setAtsResult(null);
      setAtsModalOpen(true);
      return;
    }

    setAtsLoading(true);
    try {
      const resumeData = {
        personalInfo: resumeContext.personalInfo,
        summary: resumeContext.summary,
        experience: resumeContext.experience,
        education: resumeContext.education,
        skills: resumeContext.skills,
        projects: resumeContext.projects,
        certifications: resumeContext.certifications
      };

      const result = await performAdvancedATSAnalysis(resumeData);
      setAtsResult(result);
      setAtsModalOpen(true);
    } catch (error) {
      console.error('ATS analysis failed:', error);
      showError('ATS analysis failed. Please try again.');
    } finally {
      setAtsLoading(false);
    }
  };

  // Handle file upload for ATS analysis
  const handleFileUploadForATS = async (file) => {
    let loadingId = null;

    try {
      loadingId = showLoading('Processing uploaded resume...', 'Extracting text and analyzing content');

      // Extract text from the uploaded file
      const extractedText = await extractTextFromFile(file);

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error('Unable to extract sufficient text from the file. Please ensure the file contains readable text.');
      }

      // Parse the extracted text into resume data structure
      const parsedResumeData = parseResumeText(extractedText);

      // Validate the parsed data
      if (!validateResumeData(parsedResumeData)) {
        throw new Error('The uploaded file does not appear to contain valid resume content.');
      }

      // Perform ATS analysis on the uploaded resume
      const result = await performAdvancedATSAnalysis(parsedResumeData);

      // Remove loading notification
      if (loadingId) {
        notificationService.remove(loadingId);
      }

      // Update the modal with the new results
      setAtsResult(result);
      // Modal should already be open, just update the results

      // Show a brief success notification
      showSuccess(
        'File Analyzed Successfully!',
        `ATS analysis completed. Overall score: ${result.overallScore}/100`
      );

    } catch (error) {
      // Remove loading notification
      if (loadingId) {
        notificationService.remove(loadingId);
      }

      console.error('File upload ATS analysis failed:', error);
      showError(
        'File Analysis Failed',
        error.message || 'Failed to analyze the uploaded file. Please try again with a different file.'
      );
      throw error; // Re-throw to handle in the modal
    }
  };

  // Smart Grammar Check logic
  const handleGrammarCheck = async () => {
    setGrammarLoading(true);
    try {
      const resumeData = {
        personalInfo: resumeContext.personalInfo,
        summary: resumeContext.summary,
        experience: resumeContext.experience,
        education: resumeContext.education,
        skills: resumeContext.skills,
        projects: resumeContext.projects,
        certifications: resumeContext.certifications
      };

      const result = await performGrammarCheck(resumeData);
      setGrammarResult(result);
      setGrammarModalOpen(true);
    } catch (error) {
      console.error('Grammar check failed:', error);
      showError('Grammar check failed. Please try again.');
    } finally {
      setGrammarLoading(false);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
    { id: 'summary', label: 'Summary', icon: 'fas fa-align-left' },
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-cogs' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'certifications', label: 'Certifications', icon: 'fas fa-certificate' },
    { id: 'additionalInfo', label: 'Additional Information', icon: 'fas fa-info-circle' }
  ];


  // Auto-save functionality removed

  const handleSave = async () => {
    if (!user) {
      showError('Authentication Required', 'Please log in to save your resume.');
      return;
    }

    // Show loading notification
    const loadingId = showLoading('Saving Resume', 'Please wait while we save your resume...');

    try {
      const result = await saveResume();

      // Remove loading notification
      notificationService.remove(loadingId);

      if (result && result.success) {
        showSuccess(
          'Resume Saved Successfully!',
          'Your resume has been saved to the database and can be accessed from your dashboard.'
        );
      } else {
        showError(
          'Save Failed',
          (result && result.error) || 'An unexpected error occurred while saving your resume.'
        );
      }
    } catch (error) {
      console.error('Save error caught:', error); // Debug log
      // Remove loading notification
      notificationService.remove(loadingId);

      showError(
        'Save Failed',
        error.message || 'An unexpected error occurred while saving your resume.'
      );
    }
  };

  const handleExportPDF = async () => {
    if (!user) {
      showError('Authentication Required', 'Please log in to export your resume.');
      return;
    }

    // Get current resume data for validation and filename generation
    const resumeData = {
      personalInfo: resumeContext.personalInfo,
      summary: resumeContext.summary,
      experience: resumeContext.experience,
      education: resumeContext.education,
      skills: resumeContext.skills,
      projects: resumeContext.projects,
      certifications: resumeContext.certifications,
      additionalInfo: resumeContext.additionalInfo
    };

    // Show loading notification
    const loadingId = showLoading('Exporting PDF', 'Please wait while we generate your resume PDF...');

    try {
      const result = await exportResumeToPDF(resumeData, {
        elementId: 'resume-preview',
        quality: 2,
        format: 'a4',
        orientation: 'portrait'
      });

      // Remove loading notification
      notificationService.remove(loadingId);

      if (result.success) {
        showSuccess(
          'PDF Export Successful!',
          `Your resume has been downloaded as ${result.filename}`
        );
      } else {
        showError(
          'Export Failed',
          result.error || 'Failed to export PDF. Please try again.'
        );
      }
    } catch (error) {
      // Remove loading notification
      notificationService.remove(loadingId);

      console.error('PDF export failed:', error);
      showError(
        'Export Failed',
        error.message || 'An unexpected error occurred while exporting your resume.'
      );
    }
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfo />;
      case 'summary':
        return <Summary />;
      case 'experience':
        return <Experience />;
      case 'education':
        return <Education />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'certifications':
        return <Certifications />;
      case 'additionalInfo':
        return <AdditionalInfo />;
      default:
        return <PersonalInfo />;
    }
  };



  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" />
        <p>Loading resume builder...</p>
      </div>
    );
  }

  return (
    <div className="resume-builder-page">
      <Header />



      <div className="builder-container">
        <div className="builder-sidebar">
          {/* <div className="sidebar-header">
            <h2>Resume Builder</h2>
            {/* Auto-save status removed */}
          {/* </div> */ }

          <nav className="section-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <i className={section.icon}></i>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-actions">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading}
              className="save-btn .save-btn:hover"
            >
              <i className="fas fa-save">&nbsp;</i>
               Save Resume
            </Button>

            <Button
              variant="secondary"
              onClick={handleExportPDF}
              className="export-btn"
            >
              <i className="fas fa-download">&nbsp;</i>
              Export PDF
            </Button>
            <Button
              variant="secondary"
              onClick={handleATSCheck}
              disabled={atsLoading}
              className="ats-btn"
            >
              <i className={atsLoading ? "fas fa-spinner fa-spin" : "fas fa-robot"}>&nbsp;</i>
              {atsLoading ? 'Analyzing...' : 'Advanced ATS Check'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleGrammarCheck}
              disabled={grammarLoading}
              className="grammar-btn"
            >
              <i className={grammarLoading ? "fas fa-spinner fa-spin" : "fas fa-spell-check"}>&nbsp;</i>
              {grammarLoading ? 'Checking...' : 'Smart Grammar Check'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="back-btn"
            >
              <i className="fas fa-arrow-left">&nbsp;</i>
              Back to Dashboard
            </Button>
          </div>
      {/* Advanced ATS Modal */}
      <AdvancedATSModal
        isOpen={atsModalOpen}
        onClose={() => setAtsModalOpen(false)}
        atsResult={atsResult}
        onFileUpload={handleFileUploadForATS}
      />

      {/* Smart Grammar Check Modal */}
      <GrammarCheckModal
        isOpen={grammarModalOpen}
        onClose={() => setGrammarModalOpen(false)}
        grammarResult={grammarResult}
      />
        </div>

        <div className="builder-content">
          <div className="form-panel">
            <div className="form-container">
              {renderCurrentSection()}
            </div>
          </div>

          <div className="preview-panel">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* PDF Export Loading Overlay */}
      <div id="pdf-loading" style={{ display: 'none' }} className="pdf-loading-overlay">
        <div className="pdf-loading-content">
          <LoadingSpinner size="large" />
          <h3>Generating PDF...</h3>
          <p>Please wait while we create your professional resume PDF.</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
