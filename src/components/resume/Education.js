
import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import Button from '../common/Button';
import { createEducationItem, formatDateForInput } from '../../utils/helpers';

const Education = () => {
  const { education, dispatch } = useResume();

  const addEducation = () => {
    const newEducation = createEducationItem();
    dispatch({
      type: 'ADD_EDUCATION',
      payload: newEducation
    });
  };

  const updateEducation = (id, field, value) => {
    const updatedEducation = education.find(edu => edu.id === id);
    if (updatedEducation) {
      dispatch({
        type: 'UPDATE_EDUCATION',
        payload: {
          ...updatedEducation,
          [field]: value
        }
      });
    }
  };

  const deleteEducation = (id) => {
    dispatch({
      type: 'DELETE_EDUCATION',
      payload: id
    });
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <h3>Education</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={addEducation}
        >
          <i className="fas fa-plus"></i> Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-graduation-cap"></i>
          <p>No education added yet</p>
          <Button variant="primary" onClick={addEducation}>
            Add Your Education
          </Button>
        </div>
      ) : (
        <div className="education-list">
          {education.map((edu, index) => (
            <div key={edu.id} className="education-item">
              <div className="item-header">
                <h4>Education {index + 1}</h4>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => deleteEducation(edu.id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="e.g., Harvard University"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Degree *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="e.g., Bachelor of Science"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>GPA</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="e.g., 3.8/4.0"
                  />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(edu.startDate)}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(edu.endDate)}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
