import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';
import '../../styles/templates/CorporateTemplate.css';

const CorporateTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  return (
    <div className="resume-template corporate-template">
      {/* Header Section */}
      <div className="resume-header">
        <div className="header-content">
          <div className="personal-info">
            <h1 className="name">{personalInfo.fullName}</h1>
            {personalInfo.jobRole && <h2 className="job-title">{personalInfo.jobRole}</h2>}
            <div className="contact-info">
              <div className="contact-row">
                <span>{personalInfo.email}</span>
                {personalInfo.phone && <span> • {personalInfo.phone}</span>}
                {personalInfo.address && <span> • {personalInfo.address}</span>}
              </div>
              {(personalInfo.linkedin || personalInfo.portfolio) && (
                <div className="contact-row">
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                  {personalInfo.portfolio && personalInfo.linkedin && <span> • </span>}
                  {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                </div>
              )}
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
          <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
          {experience.map((exp, index) => (
            <div key={index} className="corp-experience-item">
              <div className="experience-header">
                <div className="position-company">
                  <span className="position">{exp.position}</span>
                  <span className="company"> | {exp.company}</span>
                </div>
                <div className="dates">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.description && (
                <div className="experience-description">
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i} className="summary-text">• {line}</div>
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
            <div key={index} className="corp-education-item">
              <div className="education-header">
                <div className="degree-institution">
                  <span className="degree">{edu.degree}</span>
                  {edu.field && <span className="field"> in {edu.field}</span>}
                  <span className="institution"> | {edu.institution}</span>
                </div>
                <div className="dates">
                  GPA: {edu.gpa} &nbsp;&nbsp; {formatDate(edu.startDate)} - {formatDate(edu.endDate)} 
                </div>
              </div>
             
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">CORE COMPETENCIES</h2>
          {Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => (
            <div key={category} className="corp-skill-category">
              <h4 className="category-title">{getCategoryDisplayName(category)} :</h4>
              <div className="skills-grid">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="corp-skill-item">
                    <span className="skill-name">{skill.name}</span>
                    {/* <span className="skill-level">({skill.level})</span> */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">KEY PROJECTS</h2>
          {projects.map((project, index) => (
            <div key={index} className="corp-project-item">
              <div className="project-header">
                <span className="project-name">{project.name}</span>
                {project.url && (
                  <span className="project-url"> | {project.url}</span>
                )}
              </div>
              {project.description && (
                <div className="project-description">{project.description}</div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="project-technologies">
                  <strong>Technologies:</strong> {project.technologies.join(', ')}
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
            <div key={index} className="corp-certification-item">
              <span className="cert-name">{cert.name}</span>
              {cert.issuer && <span className="cert-issuer"> | {cert.issuer}</span>}
              {cert.date && <span className="cert-date"> | {formatDate(cert.date)}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">ADDITIONAL INFORMATION</h2>
          {additionalInfo.map((info, index) => (
            <div key={index} className="corp-additional-info-item">
              <span className="info-type">{info.type}</span>
              <span className="info-description"> | {info.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorporateTemplate;
