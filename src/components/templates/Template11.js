
import React from 'react';
import './template11.css';
import { groupSkillsByCategory, getCategoryDisplayName } from '../../utils/helpers';

const Template11 = ({ personalInfo, summary, education, experience, projects, skills, certifications, achievements, additionalInfo }) => {
  const groupedSkills = groupSkillsByCategory(skills);
  return (
    <div className="tpl11-root">
      {/* Header Section */}
      <div className="tpl11-header">
        <h1 className="tpl11-name">{personalInfo?.fullName}</h1>
        <div className="tpl11-contact">
          {personalInfo?.jobRole && (
            <span className="tpl11-contact-role"><i className="fas fa-briefcase"></i> {personalInfo.jobRole}</span>
          )}
          {personalInfo?.email && (
            <span className="tpl11-contact-email"><i className="fas fa-envelope"></i> {personalInfo.email}</span>
          )}
          {personalInfo?.phone && (
            <span className="tpl11-contact-phone"><i className="fas fa-phone"></i> {personalInfo.phone}</span>
          )}
          {personalInfo?.address && (
            <span className="tpl11-contact-address"><i className="fas fa-map-marker-alt"></i> {personalInfo.address}</span>
          )}
          {personalInfo?.portfolio && (
            <span className="tpl11-contact-portfolio"><i className="fas fa-globe"></i> <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>
          )}
          {personalInfo?.customLinks && personalInfo.customLinks.map((link, idx) => (
            <span key={idx} className="tpl11-contact-custom"><i className="fas fa-link"></i> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a></span>
          ))}
          {personalInfo?.linkedin && (
            <span className="tpl11-contact-linkedin"><i className="fab fa-linkedin"></i> <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
          )}
          {personalInfo?.github && (
            <span className="tpl11-contact-github"><i className="fab fa-github"></i> <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a></span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Profile Summary</h2>
          <div className="tpl11-summary">{summary}</div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Education</h2>
          <ul className="tpl11-list">
            {education.map((edu, idx) => (
              <li key={idx} className="tpl11-list-item">
                <div className="tpl11-row">
                  <span className="tpl11-edu-institution">{edu.institution}</span>
                  <span className="tpl11-edu-dates">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="tpl11-row">
                  <span className="tpl11-edu-degree">{edu.degree} in {edu.field} {edu.stream ? `, ${edu.stream}` : ''}</span>
                  {edu.gpa && <span className="tpl11-edu-gpa">CGPA: {edu.gpa}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Achievements</h2>
          <ul className="tpl11-list">
            {achievements.map((ach, idx) => (
              <li key={idx} className="tpl11-list-item tpl11-achievement">{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Experience</h2>
          <ul className="tpl11-list">
            {experience.map((exp, idx) => (
              <li key={idx} className="tpl11-list-item">
                <div className="tpl11-row">
                  <span className="tpl11-exp-company">{exp.company}</span>
                  <span className="tpl11-exp-dates">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <div className="tpl11-row">
                  <span className="tpl11-exp-position">{exp.position}</span>
                  <span className="tpl11-exp-location">{exp.location}</span>
                </div>
                {exp.description && <div className="tpl11-exp-desc">{exp.description}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Notable Projects</h2>
          <ul className="tpl11-list">
            {projects.map((proj, idx) => (
              <li key={idx} className="tpl11-list-item">
                <div className="tpl11-row">
                  <span className="tpl11-proj-name">{proj.name}</span>
                  <span className="tpl11-proj-date">{proj.date}</span>
                </div>
                <div className="tpl11-row">
                  <span className="tpl11-proj-role">{proj.role}</span>
                </div>
                {proj.description && <div className="tpl11-proj-desc">{proj.description}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills - Grouped by Category */}
      {skills && skills.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Skills</h2>
          <div className="tpl11-skills">
            {Object.keys(groupedSkills).map((category, idx) => (
              <div key={category} className="tpl11-skill-category">
                <span className="tpl11-skill-category-label">{getCategoryDisplayName(category)}:</span>{' '}
                {groupedSkills[category]
                  .map(skill => skill.name)
                  .filter(Boolean)
                  .map((name, i, arr) => (
                    <span key={i} className="tpl11-skill-name">
                      {name}{i < arr.length - 1 ? ', ' : ''}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Additional Information</h2>
          <ul className="tpl11-list">
            {additionalInfo.map((info, idx) => (
              <li key={idx} className="tpl11-list-item">
                <div className="tpl11-additional-type">{info.type}</div>
                <div className="tpl11-additional-desc">{info.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="tpl11-section">
          <h2 className="tpl11-section-header">Certifications</h2>
          <ul className="tpl11-list">
            {certifications.map((cert, idx) => (
              <li key={idx} className="tpl11-list-item">
                <div className="tpl11-row">
                  <span className="tpl11-cert-name">{cert.name}</span>
                  <span className="tpl11-cert-issuer">- {cert.issuer}</span>
                </div>
                <div className="tpl11-row">
                  <span className="tpl11-cert-date">{cert.date}</span>
                  {cert.url && <a className="tpl11-cert-url" href={cert.url} target="_blank" rel="noopener noreferrer">Verify</a>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Template11;
