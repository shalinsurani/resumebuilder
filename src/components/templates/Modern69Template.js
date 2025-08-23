import React from 'react';
import { groupSkillsByCategory, getCategoryDisplayName } from '../../utils/helpers';
import '../../styles/templates/modern69-template.css';

const Modern69Template = ({ 
  personalInfo, 
  summary, 
  experience, 
  education, 
  skills, 
  projects, 
  certifications, 
  additionalInfo 
}) => {
  const skillsByCategory = groupSkillsByCategory(skills);

  return (
    <div className="modern69-container">
      <div className="modern69-page">
        <div className="modern69-column-container">
          {/* Left Column */}
          <div className="modern69-left-column">
            {/* Profile Photo */}
            {personalInfo?.photoURL && (
              <div className="modern69-photo-section">
                <img src={personalInfo.photoURL} alt="Profile" className="modern69-profile-photo" />
              </div>
            )}

            {/* Contact Information */}
            <section className="modern69-section modern69-contact-section">
              <h2 className="modern69-section-title">CONTACT</h2>
              <div className="modern69-contact-content">
                {personalInfo?.address && (
                  <div className="modern69-contact-item">
                    <i className="fas fa-map-marker-alt modern69-contact-icon"></i>
                    <span>{personalInfo.address}</span>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="modern69-contact-item">
                    <i className="fas fa-phone modern69-contact-icon"></i>
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="modern69-contact-item">
                    <i className="fas fa-envelope modern69-contact-icon"></i>
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo?.linkedin && (
                  <div className="modern69-contact-item">
                    <i className="fab fa-linkedin modern69-contact-icon"></i>
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo?.portfolio && (
                  <div className="modern69-contact-item">
                    <i className="fas fa-globe modern69-contact-icon"></i>
                    <span>{personalInfo.portfolio}</span>
                  </div>
                )}
                {personalInfo?.customLinks && personalInfo.customLinks.map((link, index) => (
                  <div key={index} className="modern69-contact-item">
                    <i className="fas fa-link modern69-contact-icon"></i>
                    <span>{link.name}: {link.url}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            {education && education.length > 0 && (
              <section className="modern69-section modern69-education-section">
                <h2 className="modern69-section-title">EDUCATION</h2>
                <div className="modern69-education-content">
                  {education.map((edu, index) => (
                    <div key={edu.id || index} className="modern69-education-item">
                      <div className="modern69-education-header">
                        <span className="modern69-education-date">
                          {edu.startDate && new Date(edu.startDate).getFullYear()}
                          {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                          {edu.endDate ? new Date(edu.endDate).getFullYear() : (edu.isPresent ? 'Present' : '')}
                        </span>
                      </div>
                      <h3 className="modern69-education-institution">{edu.institution}</h3>
                      <h4 className="modern69-education-degree">{edu.degree} in {edu.field}</h4>
                      {edu.gpa && <p className="modern69-education-gpa">GPA: {edu.gpa}</p>}
                      {edu.description && <p className="modern69-education-description">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications Section */}
            {certifications && certifications.length > 0 && (
              <section className="modern69-section modern69-certifications-section">
                <h2 className="modern69-section-title">CERTIFICATIONS</h2>
                <div className="modern69-certifications-content">
                  {certifications.map((cert, index) => (
                    <div key={cert.id || index} className="modern69-certification-item">
                      <div className="modern69-certification-header">
                        <h3 className="modern69-certification-name">{cert.name}</h3>
                        <span className="modern69-certification-date">
                          {cert.date && new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="modern69-certification-issuer">{cert.issuer}</p>
                      {cert.description && <p className="modern69-certification-description">{cert.description}</p>}
                      {cert.credentialId && (
                        <p className="modern69-certification-credential">Credential ID: {cert.credentialId}</p>
                      )}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="modern69-certification-link">
                          View Credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="modern69-right-column">
            {/* Header */}
            <header className="modern69-header">
              <div className="modern69-header-content">
                <h1 className="modern69-name">{personalInfo?.fullName || 'Your Name'}</h1>
                {personalInfo?.jobRole && <h2 className="modern69-job-title">{personalInfo.jobRole}</h2>}
              </div>
            </header>

            {/* Profile Summary */}
            {summary && (
              <section className="modern69-section modern69-profile-section">
                <h2 className="modern69-section-title">PROFILE</h2>
                <p className="modern69-profile-summary">{summary}</p>
              </section>
            )}

            {/* Work Experience */}
            {experience && experience.length > 0 && (
              <section className="modern69-section modern69-experience-section">
                <h2 className="modern69-section-title">WORK EXPERIENCE</h2>
                <div className="modern69-experience-content">
                  {experience.map((exp, index) => (
                    <div key={exp.id || index} className="modern69-experience-item">
                      <div className="modern69-experience-header">
                        <h3 className="modern69-experience-company">{exp.company}</h3>
                        <span className="modern69-experience-date modern69-date-box">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -
                          {exp.current ? 'NOW' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <h4 className="modern69-experience-position">{exp.position}</h4>
                      <p className="modern69-experience-location">{exp.location}</p>
                      {exp.description && (
                        <div className="modern69-experience-description">
                          <ul>
                            {exp.description.split('\n').map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
              <section className="modern69-section modern69-projects-section">
                <h2 className="modern69-section-title">PROJECTS</h2>
                <div className="modern69-projects-content">
                  {projects.map((project, index) => (
                    <div key={project.id || index} className="modern69-project-item">
                      <div className="modern69-project-header">
                        <h3 className="modern69-project-name">{project.name}</h3>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="modern69-project-link">
                            View Project
                          </a>
                        )}
                      </div>
                      {project.technologies && project.technologies.length > 0 && (
                        <p className="modern69-project-tech">
                          <strong>Technologies:</strong> {project.technologies.join(', ')}
                        </p>
                      )}
                      {project.description && (
                        <div className="modern69-project-description">
                          <ul>
                            {project.description.split('\n').map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills Section */}
            {skills && skills.length > 0 && Object.keys(skillsByCategory).length > 0 && (
              <section className="modern69-section modern69-skills-section">
                <h2 className="modern69-section-title">SKILLS</h2>
                <div className="modern69-additional-content">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="modern69-additional-item">
                      <p className="modern69-additional-description">
                        <strong>{getCategoryDisplayName(category)} : </strong>
                        {skills.map(skill => skill.name).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Information */}
            {additionalInfo && additionalInfo.length > 0 && (
              <section className="modern69-section modern69-additional-section">
                <h2 className="modern69-section-title">ADDITIONAL INFORMATION</h2>
                <div className="modern69-additional-content">
                  {additionalInfo.map((info, index) => (
                    <div key={index} className="modern69-additional-item">
                      <h3 className="modern69-additional-type">{info.type}</h3>
                      <p className="modern69-additional-description">{info.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modern69Template;