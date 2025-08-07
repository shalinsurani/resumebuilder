
import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

const ClassicTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  return (
    <div className="resume-template classic-template">
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
                <h3 className="job-title">{exp.jobTitle}</h3>
                <span className="date-range">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <h4 className="company">{exp.company}</h4>
              {exp.description && (
                <ul className="job-description">
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
              <h4 className="institution">{edu.school}</h4>
              {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Additional Information Section */}
      <div className="resume-section additional-section">
        <h2 className="section-title">ADDITIONAL INFORMATION</h2>

        {/* Technical Skills */}
        {skills && skills.length > 0 && (
          <div className="info-subsection">
            <h4 className="subsection-title">Technical Skills:</h4>
            <p className="skills-text">
              {skills.map(skill => skill.name).join(', ')}
            </p>
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

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <div className="section-content">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {})
            ).map(([category, categorySkills]) => (
              <div key={category} className="skill-category">
                <strong>{category}:</strong>{' '}
                {categorySkills.map((skill, index) => (
                  <span key={skill.id}>
                    {skill.name}{index < categorySkills.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          <div className="section-content">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                      View Project
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="project-technologies">
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">CERTIFICATIONS</h2>
          <div className="section-content">
            {certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <div className="certification-header">
                  <h3 className="certification-name">{cert.name}</h3>
                  <div className="certification-date">{formatDate(cert.date)}</div>
                </div>
                <p className="certification-issuer">{cert.issuer}</p>
                {cert.credentialId && (
                  <p className="credential-id">Credential ID: {cert.credentialId}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">ADDITIONAL INFORMATION</h2>
          <div className="section-content">
            {additionalInfo.map((info, index) => (
              <div key={index} className="additional-info-item">
                <h4 className="subsection-title">{info.type}:</h4>
                <p>{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
