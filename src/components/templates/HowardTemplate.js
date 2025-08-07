import React from 'react';
import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

const HowardTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications, additionalInfo }) => {
  const skillsByCategory = groupSkillsByCategory(skills);

  return (
    <div className="resume-template howard-template">
      <div className="template-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          {/* Profile Photo */}
          <div className="profile-section">
            {personalInfo?.photoURL ? (
              <img src={personalInfo.photoURL} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="contact-section">
            <h3 className="sidebar-title">My Contact</h3>
            <div className="contact-items">
              {personalInfo?.email && (
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.phone && (
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo?.address && (
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{personalInfo.address}</span>
                </div>
              )}
              {personalInfo?.portfolio && (
                <div className="contact-item">
                  <i className="fas fa-globe"></i>
                  <span>{personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hard Skills */}
          {skills && skills.length > 0 && skillsByCategory['Technical'] && (
            <div className="skills-section">
              <h3 className="sidebar-title">Hard Skill</h3>
              <ul className="skills-list">
                {skillsByCategory['Technical'].map((skill, index) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
                {skillsByCategory['Tools'] && skillsByCategory['Tools'].map((skill, index) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
                {skillsByCategory['Frameworks'] && skillsByCategory['Frameworks'].map((skill, index) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft Skills */}
          {skills && skills.length > 0 && skillsByCategory['Soft Skills'] && (
            <div className="skills-section">
              <h3 className="sidebar-title">Soft Skill</h3>
              <ul className="skills-list">
                {skillsByCategory['Soft Skills'].map((skill, index) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="education-section">
              <h3 className="sidebar-title">Education Background</h3>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="education-item">
                  <div className="education-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="education-content">
                    <h4 className="education-title">{edu.institution}</h4>
                    <p className="education-degree">{edu.degree}</p>
                    <p className="education-field">{edu.field}</p>
                    <p className="education-date">Completed in {new Date(edu.endDate).getFullYear()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <div className="header-section">
            <h1 className="name">{personalInfo?.fullName || 'Your Name'}</h1>
            {personalInfo?.jobRole && <h2 className="title">{personalInfo.jobRole}</h2>}
          </div>

          {/* About Me */}
          {summary && (
            <div className="content-section">
              <h3 className="section-title">About Me</h3>
              <p className="about-text">{summary}</p>
            </div>
          )}

          {/* Professional Experience */}
          {experience && experience.length > 0 && (
            <div className="content-section">
              <h3 className="section-title">Professional Experience</h3>
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="experience-item">
                  <div className="experience-header">
                    <h4 className="job-title">{exp.company} | {exp.position}</h4>
                    <span className="date-range">
                      {new Date(exp.startDate).getFullYear()} – {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                    </span>
                  </div>
                  <div className="job-responsibilities">
                    <p><strong>Key responsibilities:</strong></p>
                    {exp.description && (
                      <ul>
                        {exp.description.split('\n').map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {certifications && certifications.length > 0 && (
            <div className="content-section">
              <h3 className="section-title">Achievements</h3>
              <div className="achievements-list">
                {certifications.map((cert, index) => (
                  <div key={cert.id || index} className="achievement-item">
                    <span className="achievement-date">{new Date(cert.date).getFullYear()}</span>
                    <span className="achievement-text">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {additionalInfo && additionalInfo.length > 0 && (
            <div className="content-section">
              <h3 className="section-title">Additional Information</h3>
              <div className="additional-info-list">
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
      </div>
    </div>
  );
};

export default HowardTemplate;
