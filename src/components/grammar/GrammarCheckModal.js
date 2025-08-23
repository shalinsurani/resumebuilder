import React, { useState } from 'react';
import Button from '../common/Button';
import './GrammarCheckModal.css';

const GrammarCheckModal = ({ isOpen, onClose, grammarResult }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssue, setSelectedIssue] = useState(null);

  if (!isOpen || !grammarResult) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 80) return '#22c55e'; // Light green
    if (score >= 70) return '#eab308'; // Yellow
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    return 'F';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'spelling': return '📝';
      case 'grammar': return '📚';
      case 'punctuation': return '❗';
      case 'style': return '✨';
      case 'resume': return '📄';
      default: return '📋';
    }
  };

  const ScoreCircle = ({ score, label, size = 80 }) => (
    <div className="grammar-score-circle-container">
      <div 
        className="grammar-score-circle" 
        style={{ 
          width: size, 
          height: size,
          background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #e5e7eb 0deg)`
        }}
      >
        <div className="grammar-score-inner">
          <span className="grammar-score-number">{score}</span>
          <span className="grammar-score-grade">{getScoreGrade(score)}</span>
        </div>
      </div>
      <p className="grammar-score-label">{label}</p>
    </div>
  );

  const renderOverview = () => (
    <div className="grammar-overview">
      <div className="grammar-main-score">
        <ScoreCircle score={grammarResult.overallScore} label="Grammar Score" size={120} />
        <div className="grammar-score-details">
          <div className="score-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Rule-based Analysis</span>
              <span className="breakdown-value">{grammarResult.grammarScore}/100</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">AI Analysis</span>
              <span className="breakdown-value">{grammarResult.aiScore}/100</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Total Issues Found</span>
              <span className="breakdown-value">{grammarResult.totalIssues}</span>
            </div>
          </div>

          {/* Quick mistake summary */}
          <div className="mistake-summary">
            <div className="mistake-summary-item">
              <span className="mistake-count spelling">{grammarResult.issuesByCategory.spelling?.length || 0}</span>
              <span className="mistake-label">Spelling Errors</span>
            </div>
            <div className="mistake-summary-item">
              <span className="mistake-count grammar">{grammarResult.issuesByCategory.grammar?.length || 0}</span>
              <span className="mistake-label">Grammar Issues</span>
            </div>
            <div className="mistake-summary-item">
              <span className="mistake-count style">{grammarResult.issuesByCategory.style?.length || 0}</span>
              <span className="mistake-label">Style Issues</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grammar-summary-stats">
        <div className="stat-card high">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <span className="stat-number">{grammarResult.issuesBySeverity.high.length}</span>
            <span className="stat-label">Critical Issues</span>
          </div>
        </div>
        <div className="stat-card medium">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <span className="stat-number">{grammarResult.issuesBySeverity.medium.length}</span>
            <span className="stat-label">Medium Issues</span>
          </div>
        </div>
        <div className="stat-card low">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <span className="stat-number">{grammarResult.issuesBySeverity.low.length}</span>
            <span className="stat-label">Style Issues</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-number">{grammarResult.statistics.wordsAnalyzed}</span>
            <span className="stat-label">Words Checked</span>
          </div>
        </div>
      </div>

      {/* Critical Grammar & Spelling Mistakes */}
      {(grammarResult.issuesBySeverity.high.length > 0 ||
        (grammarResult.issuesByCategory.spelling && grammarResult.issuesByCategory.spelling.length > 0) ||
        (grammarResult.issuesByCategory.grammar && grammarResult.issuesByCategory.grammar.length > 0)) && (
        <div className="critical-mistakes-section">
          <h4>🚨 Critical Grammar & Spelling Issues</h4>
          <div className="critical-mistakes-grid">
            {/* Show spelling mistakes */}
            {grammarResult.issuesByCategory.spelling && grammarResult.issuesByCategory.spelling.slice(0, 4).map((issue, index) => (
              <div key={`spelling-${index}`} className="mistake-card spelling">
                <div className="mistake-header">
                  <span className="mistake-icon">📝</span>
                  <span className="mistake-type">Spelling</span>
                </div>
                <div className="mistake-content">
                  <div className="mistake-error">"{issue.text}"</div>
                  <div className="mistake-correction">
                    → {issue.source === 'ai' ? 'AI-detected issue - see AI Insights for details' : issue.correction}
                  </div>
                  <div className="mistake-location">{issue.section} {issue.source === 'ai' ? '(AI-detected)' : ''}</div>
                </div>
              </div>
            ))}

            {/* Show grammar mistakes */}
            {grammarResult.issuesByCategory.grammar && grammarResult.issuesByCategory.grammar.slice(0, 4).map((issue, index) => (
              <div key={`grammar-${index}`} className="mistake-card grammar">
                <div className="mistake-header">
                  <span className="mistake-icon">📚</span>
                  <span className="mistake-type">Grammar</span>
                </div>
                <div className="mistake-content">
                  <div className="mistake-error">"{issue.text}"</div>
                  <div className="mistake-correction">
                    → {issue.source === 'ai' ? 'AI-detected issue - see AI Insights for details' : issue.correction}
                  </div>
                  <div className="mistake-location">{issue.section} {issue.source === 'ai' ? '(AI-detected)' : ''}</div>
                </div>
              </div>
            ))}

            {/* Show other high severity issues */}
            {grammarResult.issuesBySeverity.high
              .filter(issue => issue.category !== 'spelling' && issue.category !== 'grammar')
              .slice(0, 2).map((issue, index) => (
              <div key={`high-${index}`} className="mistake-card high-severity">
                <div className="mistake-header">
                  <span className="mistake-icon">{getCategoryIcon(issue.category)}</span>
                  <span className="mistake-type">{issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}</span>
                </div>
                <div className="mistake-content">
                  <div className="mistake-error">"{issue.text}"</div>
                  <div className="mistake-correction">
                    → {issue.source === 'ai' ? 'AI-detected issue - see AI Insights for details' : issue.correction}
                  </div>
                  <div className="mistake-location">{issue.section} {issue.source === 'ai' ? '(AI-detected)' : ''}</div>
                </div>
              </div>
            ))}
          </div>

          {(grammarResult.issuesByCategory.spelling?.length > 4 ||
            grammarResult.issuesByCategory.grammar?.length > 4 ||
            grammarResult.issuesBySeverity.high.length > 6) && (
            <div className="more-issues-notice">
              <span>📋 View "Issues" tab to see all {grammarResult.totalIssues} problems found</span>
            </div>
          )}
        </div>
      )}

      {grammarResult.suggestions.length > 0 && (
        <div className="grammar-quick-suggestions">
          <h4>🎯 Priority Actions</h4>
          <div className="quick-suggestions-list">
            {grammarResult.suggestions.map((suggestion, index) => (
              <div key={index} className="quick-suggestion-item">
                <span className="suggestion-bullet">💡</span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderIssues = () => (
    <div className="grammar-issues">
      <div className="issues-header">
        <h4>📋 Grammar & Style Issues</h4>
        <div className="issues-filter">
          <span className="filter-info">Click on any issue for details</span>
        </div>
      </div>

      {Object.keys(grammarResult.issuesByCategory).map(category => (
        <div key={category} className="issue-category">
          <h5 className="category-header">
            {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)} 
            <span className="category-count">({grammarResult.issuesByCategory[category].length})</span>
          </h5>
          
          <div className="issues-list">
            {grammarResult.issuesByCategory[category].map((issue, index) => (
              <div 
                key={index} 
                className={`issue-item ${issue.severity} ${selectedIssue === issue ? 'selected' : ''}`}
                onClick={() => setSelectedIssue(selectedIssue === issue ? null : issue)}
              >
                <div className="issue-header">
                  <span className="severity-icon">{getSeverityIcon(issue.severity)}</span>
                  <span className="issue-text">"{issue.text}"</span>
                  <span className="issue-location">{issue.section} - {issue.field}</span>
                </div>
                
                {selectedIssue === issue && (
                  <div className="issue-details">
                    <div className="issue-context">
                      <strong>Context:</strong> ...{issue.context}...
                    </div>
                    <div className="issue-correction">
                      <strong>Suggestion:</strong> {issue.correction}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {grammarResult.totalIssues === 0 && (
        <div className="no-issues">
          <div className="no-issues-icon">🎉</div>
          <h4>Excellent Grammar!</h4>
          <p>No grammar or style issues found in your resume.</p>
        </div>
      )}
    </div>
  );

  const renderAIInsights = () => (
    <div className="grammar-ai-insights">
      <h4>🤖 AI-Powered Writing Analysis</h4>
      
      {grammarResult.aiInsights && (
        <div className="ai-analysis-sections">
          {grammarResult.aiInsights.errors.length > 0 && (
            <div className="ai-section">
              <h5>🔍 Detected Errors</h5>
              <ul className="ai-list">
                {grammarResult.aiInsights.errors.map((error, index) => (
                  <li key={index} className="ai-error-item">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {grammarResult.aiInsights.styleImprovements.length > 0 && (
            <div className="ai-section">
              <h5>✨ Style Improvements</h5>
              <ul className="ai-list">
                {grammarResult.aiInsights.styleImprovements.map((improvement, index) => (
                  <li key={index} className="ai-style-item">{improvement}</li>
                ))}
              </ul>
            </div>
          )}

          {grammarResult.aiInsights.suggestions.length > 0 && (
            <div className="ai-section">
              <h5>💡 Professional Writing Tips</h5>
              <ul className="ai-list">
                {grammarResult.aiInsights.suggestions.map((suggestion, index) => (
                  <li key={index} className="ai-suggestion-item">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="action-verbs-section">
        <h5>🚀 Powerful Action Verbs</h5>
        <p className="action-verbs-intro">Use these strong action verbs to make your resume more impactful:</p>
        <div className="action-verbs-grid">
          {grammarResult.actionVerbs.slice(0, 16).map((verb, index) => (
            <span key={index} className="action-verb-tag">{verb}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="grammar-statistics">
      <h4>📊 Analysis Statistics</h4>
      
      <div className="stats-grid">
        <div className="stat-detail-card">
          <div className="stat-detail-icon">📝</div>
          <div className="stat-detail-content">
            <span className="stat-detail-number">{grammarResult.statistics.wordsAnalyzed}</span>
            <span className="stat-detail-label">Words Analyzed</span>
          </div>
        </div>
        
        <div className="stat-detail-card">
          <div className="stat-detail-icon">📋</div>
          <div className="stat-detail-content">
            <span className="stat-detail-number">{grammarResult.statistics.sectionsChecked}</span>
            <span className="stat-detail-label">Sections Checked</span>
          </div>
        </div>
        
        <div className="stat-detail-card">
          <div className="stat-detail-icon">⚡</div>
          <div className="stat-detail-content">
            <span className="stat-detail-number">{grammarResult.statistics.processingTime}</span>
            <span className="stat-detail-label">Processing Time</span>
          </div>
        </div>
        
        <div className="stat-detail-card">
          <div className="stat-detail-icon">🤖</div>
          <div className="stat-detail-content">
            <span className="stat-detail-number">{grammarResult.statistics.aiPowered ? 'Yes' : 'No'}</span>
            <span className="stat-detail-label">AI Enhanced</span>
          </div>
        </div>
      </div>

      <div className="grammar-score-breakdown">
        <h5>Score Breakdown</h5>
        <div className="score-breakdown-chart">
          <div className="breakdown-bar">
            <div className="breakdown-segment rule-based" style={{ width: '70%' }}>
              <span>Rule-based: {grammarResult.grammarScore}</span>
            </div>
            <div className="breakdown-segment ai-based" style={{ width: '30%' }}>
              <span>AI: {grammarResult.aiScore}</span>
            </div>
          </div>
          <div className="breakdown-legend">
            <div className="legend-item">
              <div className="legend-color rule-based"></div>
              <span>Rule-based Analysis (70%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color ai-based"></div>
              <span>AI Analysis (30%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grammar-modal-overlay" onClick={onClose}>
      <div className="grammar-modal" onClick={e => e.stopPropagation()}>
        <div className="grammar-modal-header">
          <h2>📝 Smart Grammar Check</h2>
          <button className="grammar-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="grammar-tabs">
          <button 
            className={`grammar-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`grammar-tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            📋 Issues ({grammarResult.totalIssues})
          </button>
          <button 
            className={`grammar-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Insights
          </button>
          <button 
            className={`grammar-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📈 Statistics
          </button>
        </div>

        <div className="grammar-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'issues' && renderIssues()}
          {activeTab === 'ai' && renderAIInsights()}
          {activeTab === 'stats' && renderStatistics()}
        </div>

        <div className="grammar-modal-footer">
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

export default GrammarCheckModal;
