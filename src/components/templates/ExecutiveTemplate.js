import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

const ExecutiveTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  return (
    <div className="resume-template executive-template">
      {/* Header Section */}
      <div className="resume-header">
        <div className="header-content">
          <h1 className="name">{personalInfo.fullName}</h1>
          {personalInfo.jobRole && <h2 className="job-title">{personalInfo.jobRole}</h2>}
          <div className="contact-info">
            <div className="contact-line">
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.phone && <span> • {personalInfo.phone}</span>}
              <span> • {personalInfo.email}</span>
            </div>
            {personalInfo.portfolio && (
              <div className="contact-line">
                <span>{personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="resume-section">
          <h2 className="section-title">SUMMARY</h2>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">WORK EXPERIENCE</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3 className="job-title">{exp.jobTitle}, {exp.company}</h3>
                <span className="date-range">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <ul className="experience-description">
                  {exp.description.split('\n').map((item, i) => (
                    item.trim() && <li key={i}>{item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <h3 className="degree">{edu.degree}</h3>
                <span className="date-range">
                  {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
              <div className="school-info">
                <span className="school">{edu.school}</span>
                {edu.gpa && <span className="gpa"> • GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Information Section */}
      <div className="resume-section additional-section">
        <h2 className="section-title">ADDITIONAL INFORMATION</h2>

        {/* Skills by Category */}
        {skills && skills.length > 0 && (
          <div className="skills-categories">
            {Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => (
              <div key={category} className="info-subsection">
                <h4 className="subsection-title">{getCategoryDisplayName(category)}:</h4>
                <p className="skills-text">
                  {formatSkillsForDisplay(categorySkills)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        <div className="info-subsection">
          <h4 className="subsection-title">Languages:</h4>
          <p>English, Hindi, Japanese</p>
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="info-subsection">
            <h4 className="subsection-title">Certifications:</h4>
            <p>
              {certifications.map(cert => `${cert.name} (${cert.issuer})`).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="resume-section certifications-section">
          <h2 className="section-title">Professional Certifications</h2>
          <div className="section-content">
            <div className="certifications-grid">
              {certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <h3 className="certification-name">{cert.name}</h3>
                  <div className="certification-details">
                    <span className="certification-issuer">{cert.issuer}</span>
                    <span className="certification-date">{formatDate(cert.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="resume-section additional-info-section">
          <h2 className="section-title">Additional Information</h2>
          <div className="section-content">
            {additionalInfo.map((info, index) => (
              <div key={index} className="additional-info-item">
                <h4 className="info-type">{info.type}:</h4>
                <p className="info-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
