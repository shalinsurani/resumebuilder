import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

const ElegantTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  return (
    <div className="resume-template elegant-template">
      {/* Header Section */}
      <div className="resume-header">
        <div className="header-content">
          <div className="personal-info">
            <h1 className="name">{personalInfo.fullName}</h1>
            {personalInfo.jobRole && <h2 className="job-title">{personalInfo.jobRole}</h2>}
            <div className="contact-info">
              <div className="contact-line">
                {personalInfo.email}
                {personalInfo.phone && ` • ${personalInfo.phone}`}
              </div>
              <div className="contact-line">
                {personalInfo.address && personalInfo.address}
              </div>
              <div className="contact-line">
                {personalInfo.linkedin && personalInfo.linkedin}
                {personalInfo.portfolio && personalInfo.linkedin && ' • '}
                {personalInfo.portfolio && personalInfo.portfolio}
              </div>
            </div>
          </div>
          {personalInfo.photoURL && (
            <div className="photo-container">
              <img src={personalInfo.photoURL} alt="Profile" className="profile-photo" />
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="resume-section">
          <h2 className="section-title">Professional Summary</h2>
          <div className="section-content">
            <p className="summary-text">{summary}</p>
          </div>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Professional Experience</h2>
          <div className="section-content">
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <div className="position-company">
                    <h3 className="position">{exp.position}</h3>
                    <span className="company">{exp.company}</span>
                  </div>
                  <div className="dates">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
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
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Education</h2>
          <div className="section-content">
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <div className="degree-institution">
                    <h3 className="degree">{edu.degree}</h3>
                    {edu.field && <span className="field">in {edu.field}</span>}
                    <span className="institution">{edu.institution}</span>
                  </div>
                  <div className="dates">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </div>
                </div>
                {edu.gpa && (
                  <div className="gpa">GPA: {edu.gpa}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Core Competencies</h2>
          <div className="section-content">
            <div className="skills-categories">
              {Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                  <h4 className="category-title">{getCategoryDisplayName(category)}</h4>
                  <div className="skills-grid">
                    {categorySkills.map((skill, index) => (
                      <div key={skill.id} className="skill-item">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">({skill.level})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Notable Projects</h2>
          <div className="section-content">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  {project.url && (
                    <span className="project-url">{project.url}</span>
                  )}
                </div>
                {project.description && (
                  <div className="project-description">{project.description}</div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-technologies">
                    <em>Technologies:</em> {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Certifications</h2>
          <div className="section-content">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <span className="cert-name">{cert.name}</span>
                {cert.issuer && <span className="cert-issuer"> | {cert.issuer}</span>}
                {cert.date && <span className="cert-date"> | {formatDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Additional Information</h2>
          <div className="section-content">
            {additionalInfo.map((info, index) => (
              <div key={index} className="additional-info-item">
                <span className="info-type">{info.type}:</span>
                <span className="info-description"> {info.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElegantTemplate;
