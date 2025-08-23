import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

const DanielTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  const skillsByCategory = groupSkillsByCategory(skills);

  return (
    <div className="resume-template daniel-template">
      {/* Header Section */}
      <div className="resume-header">
        <h1 className="name">{personalInfo?.fullName || 'Your Name'}</h1>
        {personalInfo?.jobRole && <h2 className="title">{personalInfo.jobRole}</h2>}
        <div className="contact-info">
          {personalInfo?.address && <span>{personalInfo.address}</span>}
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="resume-section">
          <h3 className="section-title">SUMMARY</h3>
          <div className="section-content">
            <p>{summary}</p>
          </div>
        </div>
      )}

      {/* Technical Skills Section */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h3 className="section-title">TECHNICAL SKILLS</h3>
          <div className="section-content">
            <div className="skills-grid">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="skill-column">
                  <h4 className="skill-category-title">{getCategoryDisplayName(category)}</h4>
                  {categorySkills.map((skill, index) => (
                    <div key={skill.id} className="skill-item">
                      {skill.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional Experience Section */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h3 className="section-title">PROFESSIONAL EXPERIENCE</h3>
          <div className="section-content">
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="experience-item">
                <div className="experience-header">
                  <div className="job-info">
                    <h4 className="job-title">{exp.position}</h4>
                    <span className="company">{exp.company}</span>
                  </div>
                  <div className="date-range">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <div className="job-description">
                    {exp.description.split('\n').map((line, i) => (
                      <div key={i} className="description-line">• {line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="resume-section">
          <h3 className="section-title">EDUCATION</h3>
          <div className="section-content">
            {education.map((edu, index) => (
              <div key={edu.id || index} className="education-item">
                <div className="education-header">
                  <div className="education-info">
                    <h4 className="degree">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <span className="institution">{edu.institution}</span>
                  </div>
                  <div className="date-range">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
                <div className="education-details">
                  <div className="detail-line">• Major in {edu.field || 'Your Field'}.</div>
                  <div className="detail-line">• Thesis on "Technological Advancements within the current {edu.field?.split(' ')[0] || 'Industry'} Industry".</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="resume-section">
          <h3 className="section-title">ADDITIONAL INFORMATION</h3>
          <div className="section-content">
            <div className="additional-info">
              {additionalInfo.map((info, index) => (
                <div key={index} className="info-item">
                  <strong>{info.type}:</strong> {info.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DanielTemplate;
