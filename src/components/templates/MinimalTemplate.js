import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

const MinimalTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  return (
    <div className="resume-template minimal-template">
      {/* Header Section */}
      <div className="resume-header">
        <h1 className="name">{personalInfo.fullName}</h1>
        {personalInfo.jobRole && <h2 className="job-title">{personalInfo.jobRole}</h2>}
        <div className="contact-info">
          <span>{personalInfo.email}</span>
          {personalInfo.phone && <span> • {personalInfo.phone}</span>}
          {personalInfo.address && <span> • {personalInfo.address}</span>}
          {personalInfo.linkedin && <span> • {personalInfo.linkedin}</span>}
          {personalInfo.portfolio && <span> • {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="resume-section">
          <h2 className="section-title">SUMMARY</h2>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">EXPERIENCE</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <span className="position-company">{exp.position} | {exp.company}</span>
                <span className="dates">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              {exp.description && (
                <div className="experience-description">
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i} className="description-line">• {line}</div>
                  ))}
                </div>
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
                <span className="degree-institution">
                  {edu.degree}{edu.field && ` in ${edu.field}`} | {edu.institution}
                </span>
                <span className="dates">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
              {edu.gpa && <div className="gpa">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <div className="skills-categories">
            {Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => (
              <div key={category} className="skill-category">
                <h4 className="category-title">{getCategoryDisplayName(category)}:</h4>
                <div className="skills-list">
                  {categorySkills.map((skill, index) => (
                    <span key={skill.id} className="skill-item">
                      {skill.name}{index < categorySkills.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <span className="project-name">{project.name}</span>
                {project.url && <span className="project-url"> | {project.url}</span>}
              </div>
              {project.description && (
                <div className="project-description">{project.description}</div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="project-technologies">
                  Technologies: {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">CERTIFICATIONS</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              {cert.name}
              {cert.issuer && ` | ${cert.issuer}`}
              {cert.date && ` | ${formatDate(cert.date)}`}
            </div>
          ))}
        </div>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Additional Information</h2>
          <div className="additional-info-list">
            {additionalInfo.map((info, index) => (
              <div key={index} className="additional-info-item">
                <strong>{info.type}:</strong> {info.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
