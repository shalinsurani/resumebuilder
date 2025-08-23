import React from 'react';
import '../../styles/templates/template31.css';
import { formatDate, groupSkillsByCategory, getCategoryDisplayName } from '../../utils/helpers';

const Template31 = ({ 
  personalInfo = {}, 
  summary = '', 
  experience = [], 
  education = [], 
  skills = [], 
  projects = [], 
  certifications = [], 
  additionalInfo = [] 
}) => {
  // Group skills by category
  const skillsByCategory = groupSkillsByCategory(skills);
  
  return (
    <div className="t31-container">
      {/* Header Section with Photo */}
      <header className="t31-header">
        <div className="t31-header-content">
          <h1 className="t31-name">{personalInfo.fullName || 'Full Name'}</h1>
          {personalInfo.jobRole && (
            <p className="t31-job-title" style={{marginBottom: "1px"}}>{personalInfo.jobRole}</p>
          )}
          
          {/* Contact Information */}
          <div className="t31-contact-info">
            {personalInfo.email && (
              <div className="t31-contact-item">
                <span className="t31-contact-label">📧</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="t31-contact-item">
               <span className="t31-contact-label">📞</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="t31-contact-item">
                 <span className="t31-contact-label">🏠</span>
                <span>{personalInfo.address}</span>
              </div>
            )}
            {/* {personalInfo.linkedin && (
              <div className="t31-contact-item">
                <span className="t31-contact-label">LinkedIn:</span>
                <span style={{ lineHeight: "1.0", width: "100px", overflowWrap: "break-word" }}>{personalInfo.linkedin}</span>
              </div>
            )} */}
            {personalInfo.linkedin && (
  <div className="t31-contact-item">
    <span className="t31-contact-label">🔗</span>
    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </div>
)}
            {personalInfo.portfolio && (
              <div className="t31-contact-item">
                <span className="t31-contact-label">🔗</span>
                <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>
                {/* <span>{personalInfo.portfolio}</span> */}
              </div>
            )}
            {personalInfo.customLinks && personalInfo.customLinks.map((link, index) => (
              <div key={index} className="t31-contact-item">
                <span className="t31-contact-label">🔗</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                {/* <span>{link.url}</span> */}
              </div>
            ))}
          </div>
        </div>
        <div className="t31-photo-section">
          {personalInfo.photoURL && (
            <img 
              src={personalInfo.photoURL} 
              alt="Profile" 
              className="t31-photo" 
            />
          )}
        </div>
      </header>

      {/* Professional Summary Section */}
      {summary && (
        <section className="t31-section">
          <h2 className="t31-section-title">Professional Summary</h2>
          <div className="t31-summary-content">
            <p style={{marginBottom: "1px"}}>{summary}</p>
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {experience && experience.length > 0 && (
        <section className="t31-section">
          <h2 className="t31-section-title">Work Experience</h2>
          <div className="t31-experience-list">
            {experience.map((exp, index) => (
              <div key={index} className="t31-experience-item">
                <div className="t31-experience-header">
                  <h3 className="t31-company-name">{exp.company || 'Company Name'}</h3>
                  <span className="t31-position"> {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <div className="t31-experience-duration">
                    <span>
                      {exp.position || 'Position'}
                    </span>
                </div>
                {exp.description && (
                  <p className="t31-experience-description">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="t31-section">
          <h2 className="t31-section-title">Education</h2>
          <div className="t31-education-list">
            {education.map((edu, index) => (
              <div key={index} className="t31-education-item">
                <div className="t31-education-header">
                  <h3 className="t31-institution">{edu.institution || 'Institution Name'}</h3>
                  <span className="t31-degree">{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                </div>
                {edu.field && (
                  <div className="t31-field-of-study">
                    <span>{edu.degree || 'Degree'} in {edu.field} {edu.gpa && <span className="tpl11-edu-gpa">CGPA: {edu.gpa}</span>}</span>
                  </div>
                )}
                {/* <div className="t31-education-duration">
                  {edu.startDate && (
                    <span>
                      {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </span>
                  )}
                </div> */}
                {edu.description && (
                  <p className="t31-education-description">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="t31-section">
          <h2 className="t31-section-title">Skills</h2>
          <div className="t31-skills-container">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="t31-skill-category">
                <h3 className="t31-skill-category-title">{getCategoryDisplayName(category)}</h3>
                <div className="t31-category-skills">
                  {categorySkills.map((skill, index) => (
                    <span key={index} className="t31-skill-item">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="t31-section">
          <h2 className="t31-section-title">Projects</h2>
          <div className="t31-projects-list">
            {projects.map((project, index) => (
              <div key={index} className="t31-project-item">
                <div className="t31-project-header">
                  <h3 className="t31-project-name">{project.name || 'Project Name'}</h3>
                  {project.url && (
                    <a 
                      href={project.url} 
                      className="t31-project-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  )}
                </div>
                <div className="t31-project-technologies">
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="t31-tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
                {project.description && (
                  <p className="t31-project-description">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section className="t31-section">
          <h2 className="t31-section-title" style={{marginBottom:"-7px"}}>Certifications</h2>
          <div className="t31-certifications-list">
            {certifications.map((cert, index) => (
              <div key={index} className="t31-certification-item">
                <div className="t31-cert-header">
                  <h3 className="t31-cert-name">{cert.name || 'Certification Name'} - {cert.issuer || 'Issuer'}</h3>
                  {cert.url && (
                    <a 
                      href={cert.url} 
                      className="t31-cert-verify-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Verify
                    </a>
                  )}
                </div>
                
                <div className="t31-cert-details">
                  {cert.date && <span className="t31-cert-date">{cert.date}</span>}
                  {cert.credentialId && <span className="t31-cert-id">Credential ID: {cert.credentialId}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <section className="t31-section">
          <h2 className="t31-section-title">Additional Information</h2>
          <div className="t31-additional-content">
            {additionalInfo.map((info, index) => (
              <div key={index} className="t31-additional-item">
                <h3 className="t31-additional-type">{info.type || 'Information'}</h3>
                <p className="t31-additional-description">{info.description || ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Template31;