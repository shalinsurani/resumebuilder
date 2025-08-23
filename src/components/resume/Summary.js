import React, { useState, useCallback } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';
import { generateProfessionalSummary, isAIConfigured } from '../../services/aiService';
import { humanizeContent } from '../../services/humanizeService';

const Summary = () => {
  const { summary, jobDescription, personalInfo, experience, education, skills, dispatch } = useResume();
  const [aiLoading, setAiLoading] = useState(false);
  const [humanizeLoading, setHumanizeLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSummaryChange = useCallback((e) => {
    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: e.target.value
    });
  }, [dispatch]);

  const handleJobDescriptionChange = useCallback((e) => {
    dispatch({
      type: 'UPDATE_JOB_DESCRIPTION',
      payload: e.target.value
    });
  }, [dispatch]);

  // AI summary generation function
  const handleGenerateSummary = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      // Check if AI is configured
      if (!isAIConfigured()) {
        setAiError('AI service not configured. Please set REACT_APP_GEMINI_API_KEY (free) or REACT_APP_OPENAI_API_KEY in your environment variables.');
        return;
      }

      // Prepare resume data for AI generation including job description
      const resumeData = {
        personalInfo,
        experience,
        education,
        skills,
        jobDescription
      };

      // Generate summary using the AI service
      const aiSummary = await generateProfessionalSummary(resumeData);

      if (aiSummary) {
        dispatch({ type: 'UPDATE_SUMMARY', payload: aiSummary });
      } else {
        setAiError('No summary generated. Please try again.');
      }
    } catch (err) {
      console.error('AI summary generation error:', err);
      setAiError(err.message || 'AI summary generation failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }, [dispatch, personalInfo, experience, education, skills, jobDescription]);

  const handleHumanize = useCallback(async () => {
    if (!summary) return;
    setHumanizeLoading(true);
    setAiError(null);

    try {
      // Check if AI is configured (we'll use the same check since we're using Gemini)
      if (!isAIConfigured()) {
        setAiError('AI service not configured. Please set REACT_APP_GEMINI_API_KEY in your environment variables.');
        return;
      }

      // Humanize the current summary
      const humanizedSummary = await humanizeContent(summary);

      if (humanizedSummary) {
        dispatch({ type: 'UPDATE_SUMMARY', payload: humanizedSummary });
      } else {
        setAiError('No humanized content generated. Please try again.');
      }
    } catch (err) {
      console.error('Humanize error:', err);
      setAiError(err.message || 'Humanization failed. Please try again.');
    } finally {
      setHumanizeLoading(false);
    }
  }, [dispatch, summary]);

  return (
    <div className="form-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Professional Summary</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="button" variant="secondary" onClick={handleGenerateSummary} disabled={aiLoading || humanizeLoading} style={{height: 36}}>
            {aiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} AI
          </Button>
          <Button type="button" variant="outline" onClick={handleHumanize} disabled={aiLoading || humanizeLoading || !summary} style={{height: 36}}>
            {humanizeLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user"></i>} Humanize
          </Button>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="jobDescription">Target Job Description (for AI generation only)</label>
        <textarea
          id="jobDescription"
          value={jobDescription || ''}
          onChange={handleJobDescriptionChange}
          placeholder="Paste the job description you're applying for. This will help AI generate a more targeted summary..."
          rows="4"
          style={{ width: '100%' }}
        />
        <div className="form-hint">
          <i></i> This field is used only for AI generation and will <b>not</b> appear in your resume.
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          value={summary || ''}
          onChange={handleSummaryChange}
          placeholder="Write a brief summary of your professional background and career objectives..."
          rows="6"
          style={{ width: '100%' }}
        />
        <div className="form-hint">
          Write 2-3 sentences that highlight your key qualifications and career goals. Or use <b>AI</b> to generate it!
        </div>
        {aiError && <div style={{ color: 'red', marginTop: 4 }}>{aiError}</div>}
      </div>
    </div>
  );
};

export default Summary;
