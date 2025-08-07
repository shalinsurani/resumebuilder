import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import './AdvancedATSModal.css';

const AdvancedATSModal = ({ isOpen, onClose, atsResult, onFileUpload }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadMode, setUploadMode] = useState('current'); // 'current' or 'upload'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Debug logging (remove in production)
  // console.log('AdvancedATSModal render:', { isOpen, hasAtsResult: !!atsResult, uploadMode });

  // Reset upload mode when atsResult changes
  useEffect(() => {
    if (atsResult) {
      setUploadMode('current'); // Switch to results view
      setUploadError(''); // Clear any upload errors
    } else if (isOpen) {
      setUploadMode('upload'); // Start in upload mode when no results
    }
  }, [atsResult, isOpen]);

  // Handle file upload for ATS analysis
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    if (!fileName.endsWith('.txt') && !fileName.endsWith('.pdf') && fileType !== 'text/plain' && fileType !== 'application/pdf') {
      setUploadError('Please upload a TXT or PDF file. TXT files are recommended for best results.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      if (onFileUpload) {
        await onFileUpload(file);
        // Don't change upload mode here - let the parent component handle the state
        // The modal will automatically switch to results view when atsResult is set
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadError(error.message || 'Failed to process file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  // Show upload interface if no atsResult
  if (!atsResult) {
    return (
      <div className="ats-modal-overlay" onClick={onClose}>
        <div className="ats-modal advanced upload-mode" onClick={e => e.stopPropagation()}>
          <div className="ats-modal-header">
            <h2>🎯 Advanced ATS Analysis</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="ats-upload-section">
            <div className="upload-options">
              <div className="upload-option">
                <div className="upload-icon">📄</div>
                <h3>Upload Resume for Analysis</h3>
                <p>Upload your resume file to get comprehensive ATS scoring and recommendations. For best results, save your resume as a TXT file first!</p>

                <div className="file-upload-area">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.txt,application/pdf,text/plain"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />

                  <Button
                    variant="primary"
                    onClick={() => document.getElementById('resume-upload').click()}
                    disabled={uploading}
                    className="upload-btn"
                  >
                    <i className={uploading ? "fas fa-spinner fa-spin" : "fas fa-upload"}></i>
                    {uploading ? 'Processing...' : 'Choose Resume File'}
                  </Button>

                  <div className="upload-info">
                    <p><strong>Recommended:</strong> TXT files for best results</p>
                    <p>Supported formats: PDF, TXT | Maximum file size: 10MB</p>
                  </div>

                  {uploadError && (
                    <div className="upload-error">
                      <i className="fas fa-exclamation-triangle"></i>
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="ats-modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const ScoreCircle = ({ score, label, size = 80 }) => (
    <div className="score-circle-container">
      <div 
        className="score-circle" 
        style={{ 
          width: size, 
          height: size,
          background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #e5e7eb 0deg)`
        }}
      >
        <div className="score-inner">
          <span className="score-number">{score}</span>
          <span className="score-grade">{getScoreGrade(score)}</span>
        </div>
      </div>
      <p className="score-label">{label}</p>
    </div>
  );

  const renderOverview = () => (
    <div className="ats-overview">
      <div className="main-score-section">
        <ScoreCircle score={atsResult.overallScore} label="Overall ATS Score" size={120} />
        <div className="score-interpretation">
          <h4>Industry Detected: <span className="industry-tag">{atsResult.industryDetected}</span></h4>
          <div className="priority-suggestions">
            {atsResult.prioritySuggestions.map((suggestion, index) => (
              <div key={index} className="priority-item">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="detailed-scores">
        <h4>Detailed Breakdown</h4>
        <div className="score-grid">
          <ScoreCircle 
            score={atsResult.detailedScores.keywordRelevance} 
            label="Keyword Match" 
            size={70} 
          />
          <ScoreCircle 
            score={atsResult.detailedScores.experienceQuality} 
            label="Experience" 
            size={70} 
          />
          <ScoreCircle 
            score={atsResult.detailedScores.educationBackground} 
            label="Education" 
            size={70} 
          />
          <ScoreCircle 
            score={atsResult.detailedScores.formattingStructure} 
            label="Structure" 
            size={70} 
          />
          <ScoreCircle 
            score={atsResult.detailedScores.contentQuality} 
            label="Content Quality" 
            size={70} 
          />
        </div>
      </div>
    </div>
  );

  const renderKeywords = () => (
    <div className="ats-keywords">
      <div className="keyword-stats">
        <div className="stat-item">
          <span className="stat-number">{atsResult.keywordAnalysis.relevantKeywords.length}</span>
          <span className="stat-label">Keywords Found</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{atsResult.keywordAnalysis.actionVerbs.toFixed(0)}%</span>
          <span className="stat-label">Action Verbs</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{atsResult.keywordAnalysis.quantifiableMetrics.toFixed(0)}%</span>
          <span className="stat-label">Metrics Used</span>
        </div>
      </div>

      <div className="keyword-sections">
        <div className="keyword-section">
          <h4>✅ Keywords Found ({atsResult.keywordAnalysis.relevantKeywords.length})</h4>
          <div className="keyword-tags">
            {atsResult.keywordAnalysis.relevantKeywords.slice(0, 15).map((keyword, index) => (
              <span key={index} className="keyword-tag found">{keyword}</span>
            ))}
          </div>
        </div>

        <div className="keyword-section">
          <h4>❌ Missing Keywords ({atsResult.keywordAnalysis.missingKeywords.length})</h4>
          <div className="keyword-tags">
            {atsResult.keywordAnalysis.missingKeywords.slice(0, 15).map((keyword, index) => (
              <span key={index} className="keyword-tag missing">{keyword}</span>
            ))}
          </div>
          <p className="keyword-tip">
            💡 Add these keywords naturally in your experience descriptions and skills section
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="ats-suggestions">
      <h4>🎯 Improvement Recommendations</h4>
      <div className="suggestions-list">
        {atsResult.suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <span className="suggestion-icon">💡</span>
            <span className="suggestion-text">{suggestion}</span>
          </div>
        ))}
      </div>

      {atsResult.aiInsights && (
        <div className="ai-insights">
          <h4>🤖 AI-Powered Insights</h4>
          
          {atsResult.aiInsights.strengths.length > 0 && (
            <div className="insight-section">
              <h5>✅ Strengths</h5>
              <ul>
                {atsResult.aiInsights.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {atsResult.aiInsights.improvements.length > 0 && (
            <div className="insight-section">
              <h5>🔧 Areas for Improvement</h5>
              <ul>
                {atsResult.aiInsights.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}

          {atsResult.aiInsights.missingKeywords.length > 0 && (
            <div className="insight-section">
              <h5>🔑 AI-Suggested Keywords</h5>
              <div className="keyword-tags">
                {atsResult.aiInsights.missingKeywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag ai-suggested">{keyword}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="ats-analytics">
      <h4>📊 Analysis Metrics</h4>
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-value">{atsResult.analysisMetrics.processingTime}</span>
          <span className="metric-label">Processing Time</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{atsResult.analysisMetrics.wordsAnalyzed}</span>
          <span className="metric-label">Words Analyzed</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{atsResult.analysisMetrics.sectionsAnalyzed}</span>
          <span className="metric-label">Sections Checked</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{atsResult.analysisMetrics.aiPowered ? '✅' : '❌'}</span>
          <span className="metric-label">AI Enhanced</span>
        </div>
      </div>

      <div className="comparison-section">
        <h5>📈 Industry Benchmarks</h5>
        <div className="benchmark-item">
          <span>Average ATS Score ({atsResult.industryDetected})</span>
          <div className="benchmark-bar">
            <div className="benchmark-fill" style={{ width: '65%' }}></div>
            <span className="benchmark-value">65</span>
          </div>
        </div>
        <div className="benchmark-item">
          <span>Your Score</span>
          <div className="benchmark-bar">
            <div 
              className="benchmark-fill your-score" 
              style={{ 
                width: `${atsResult.overallScore}%`,
                backgroundColor: getScoreColor(atsResult.overallScore)
              }}
            ></div>
            <span className="benchmark-value">{atsResult.overallScore}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ats-modal-overlay" onClick={onClose}>
      <div className="ats-modal advanced" onClick={e => e.stopPropagation()}>
        <div className="ats-modal-header">
          <h2>🎯 Advanced ATS Analysis</h2>
          <div className="header-controls">
            <div className="mode-toggle">
              <button
                className={`mode-btn ${uploadMode === 'current' ? 'active' : ''}`}
                onClick={() => setUploadMode('current')}
              >
                Current Resume
              </button>
              <button
                className={`mode-btn ${uploadMode === 'upload' ? 'active' : ''}`}
                onClick={() => setUploadMode('upload')}
              >
                Upload File
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="ats-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'keywords' ? 'active' : ''}`}
            onClick={() => setActiveTab('keywords')}
          >
            🔑 Keywords
          </button>
          <button 
            className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            💡 Suggestions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {uploadMode === 'upload' && (
          <div className="ats-upload-section">
            <div className="upload-options">
              <div className="upload-option">
                <div className="upload-icon">📄</div>
                <h3>Upload Resume for Analysis</h3>
                <p>Upload a different resume file to compare ATS scores. TXT files work best!</p>

                <div className="file-upload-area">
                  <input
                    type="file"
                    id="resume-upload-modal"
                    accept=".pdf,.txt,application/pdf,text/plain"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />

                  <Button
                    variant="primary"
                    onClick={() => document.getElementById('resume-upload-modal').click()}
                    disabled={uploading}
                    className="upload-btn"
                  >
                    <i className={uploading ? "fas fa-spinner fa-spin" : "fas fa-upload"}></i>
                    {uploading ? 'Processing...' : 'Choose Resume File'}
                  </Button>

                  <div className="upload-info">
                    <p><strong>Recommended:</strong> TXT files for best results</p>
                    <p>Supported formats: PDF, TXT | Maximum file size: 10MB</p>
                  </div>

                  {uploadError && (
                    <div className="upload-error">
                      <i className="fas fa-exclamation-triangle"></i>
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadMode === 'current' && (
          <div className="ats-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'keywords' && renderKeywords()}
            {activeTab === 'suggestions' && renderSuggestions()}
            {activeTab === 'analytics' && renderAnalytics()}
          </div>
        )}

        <div className="ats-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close Analysis
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            📄 Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedATSModal;
