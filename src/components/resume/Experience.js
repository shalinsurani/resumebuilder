
import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';
import { createExperienceItem, formatDateForInput } from '../../utils/helpers';
import { generateExperienceDescription, isAIConfigured } from '../../services/aiService';
import { humanizeContent } from '../../services/humanizeService';

const Experience = () => {
  const { experience, dispatch } = useResume();
  const [validationErrors, setValidationErrors] = useState({});
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [humanizeLoadingId, setHumanizeLoadingId] = useState(null);
  const [aiErrorId, setAiErrorId] = useState(null);
  // Humanize the description
  const handleHumanizeDescription = async (exp) => {
    if (!exp.description) return;
    setHumanizeLoadingId(exp.id);
    setAiErrorId(null);

    try {
      if (!isAIConfigured()) {
        setAiErrorId(exp.id);
        return;
      }

      const humanizedDesc = await humanizeContent(exp.description);

      if (humanizedDesc) {
        updateExperience(exp.id, 'description', humanizedDesc);
      } else {
        setAiErrorId(exp.id);
      }
    } catch (err) {
      console.error('Humanize description error:', err);
      setAiErrorId(exp.id);
    } finally {
      setHumanizeLoadingId(null);
    }
  };

  // AI description generation
  const handleGenerateDescription = async (exp) => {
    setAiLoadingId(exp.id);
    setAiErrorId(null);

    try {
      // Check if AI is configured
      if (!isAIConfigured()) {
        setAiErrorId(exp.id);
        return;
      }

      // Generate description using the OpenAI service
      const aiDesc = await generateExperienceDescription(exp);

      if (aiDesc) {
        updateExperience(exp.id, 'description', aiDesc);
      } else {
        setAiErrorId(exp.id);
      }
    } catch (err) {
      console.error('AI experience description generation error:', err);
      setAiErrorId(exp.id);
    } finally {
      setAiLoadingId(null);
    }
  };

  const addExperience = () => {
    const newExperience = createExperienceItem();
    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: newExperience
    });
  };

  const updateExperience = (id, field, value) => {
    const updatedExperience = experience.find(exp => exp.id === id);
    if (updatedExperience) {
      dispatch({
        type: 'UPDATE_EXPERIENCE',
        payload: {
          ...updatedExperience,
          [field]: value
        }
      });
    }
  };

  const deleteExperience = (id) => {
    dispatch({
      type: 'DELETE_EXPERIENCE',
      payload: id
    });
  };

  const handleCurrentJobChange = (id, isCurrent) => {
    const updatedExperience = experience.find(exp => exp.id === id);
    if (updatedExperience) {
      dispatch({
        type: 'UPDATE_EXPERIENCE',
        payload: {
          ...updatedExperience,
          current: isCurrent,
          endDate: isCurrent ? '' : updatedExperience.endDate
        }
      });
    }
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <h3>Work Experience</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={addExperience}
        >
          <i className="fas fa-plus"></i> Add Experience
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-briefcase"></i>
          <p>No work experience added yet</p>
          <Button variant="primary" onClick={addExperience}>
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="experience-list">
          {experience.map((exp, index) => (
            <div key={exp.id} className="experience-item">
              <div className="item-header">
                <h4>Experience {index + 1}</h4>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => deleteExperience(exp.id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="e.g., Google Inc."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formatDateForInput(exp.startDate)}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(exp.endDate)}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>

                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => handleCurrentJobChange(exp.id, e.target.checked)}
                    />
                    <label htmlFor={`current-${exp.id}`}>I currently work here</label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label>Job Description</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        style={{ minWidth: 48, height: 32 }}
                        onClick={() => handleGenerateDescription(exp)}
                        disabled={aiLoadingId === exp.id || humanizeLoadingId === exp.id}
                      >
                        {aiLoadingId === exp.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} AI
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        style={{ minWidth: 48, height: 32 }}
                        onClick={() => handleHumanizeDescription(exp)}
                        disabled={aiLoadingId === exp.id || humanizeLoadingId === exp.id || !exp.description}
                      >
                        {humanizeLoadingId === exp.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user"></i>} Humanize
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows="4"
                  />
                  {aiErrorId === exp.id && <div style={{ color: 'red', marginTop: 4 }}>AI generation failed. Try again.</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
