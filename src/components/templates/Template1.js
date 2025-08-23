import React from 'react';
import '../../styles/templates/template1.css';

import { groupSkillsByCategory, getCategoryDisplayName, formatDate } from '../../utils/helpers';

const Template1 = ({
  personalInfo = {},
  summary,
  experience = [],
  education = [],
  skills = [],
  projects = [],
  certifications = [],
  additionalInfo = []
}) => {
  const skillsByCategory = groupSkillsByCategory(skills);
  return (
    <div className="template1-resume">
      <header className="template1-header">
        {personalInfo.photoURL && (
          <div className="template1-photo-section">
            <img src={personalInfo.photoURL} alt="Profile" className="template1-profile-photo" />
          </div>
        )}
        <div className="template1-title">
          <span className="template1-name">{personalInfo.fullName}</span>
        </div>
        {personalInfo.jobRole && <div className="template1-job-title">{personalInfo.jobRole}</div>}
        <div className="template1-contact">
          {personalInfo.email && <span className="template1-email"><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></span>}
          {personalInfo.phone && <span className="template1-phone">{personalInfo.phone}</span>}
          {personalInfo.address && <span className="template1-address">{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="template1-linkedin"><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
          {personalInfo.portfolio && <span className="template1-portfolio"><a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
        </div>
      </header>

      {summary && (
        <section className="template1-summary">
          <h2 className="template1-section-heading">Professional Summary</h2>
          <p className="template1-description">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="template1-experience">
          <h2 className="template1-section-heading">Experience</h2>
          <ul className="template1-experience-list">
            {experience.map((exp, idx) => (
              <li key={exp.id || idx} className="template1-experience-item">
                <div className="template1-exp-row1">
                  <span className="template1-exp-position">{exp.position}</span>
                  <span className="template1-exp-company">{exp.company}</span>
                  <span className="template1-exp-dates">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                {exp.description && (
                  <ul className="template1-exp-description">
                    {exp.description.split('\n').map((item, i) => (
                      item.trim() && <li key={i} className="template1-description">{item.trim()}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section className="template1-education">
          <h2 className="template1-section-heading">Education</h2>
          <ul className="template1-education-list">
            {education.map((edu, idx) => (
              <li key={edu.id || idx} className="template1-education-item">
                <div className="template1-edu-row1">
                  <span className="template1-edu-degree">{edu.degree}</span>
                  {edu.field && <span className="template1-edu-field">in {edu.field}</span>}
                </div>
                <div className="template1-edu-row2">
                  <span className="template1-edu-institution">{edu.institution}</span>
                  {edu.gpa && <span className="template1-edu-gpa">GPA: {edu.gpa}</span>}
                  <span className="template1-edu-dates">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="template1-skills">
          <h2 className="template1-section-heading">Skills</h2>
          <div className="template1-skills-categories">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="template1-skill-category">
                <h4 className="template1-skill-category-title">{getCategoryDisplayName ? getCategoryDisplayName(category) : category}</h4>
                <span className="template1-skill-list">{categorySkills.map((skill) => skill.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="template1-projects">
          <h2 className="template1-section-heading">Projects</h2>
          <ul className="template1-projects-list">
            {projects.map((proj, idx) => (
              <li key={proj.id || idx} className="template1-project-item">
                <div className="template1-project-row1">
                  <span className="template1-project-name">{proj.name}</span>
                  {proj.url && <span className="template1-project-url"><a href={proj.url} target="_blank" rel="noopener noreferrer">Project Link</a></span>}
                </div>
                <div className="template1-project-row2">
                  <span className="template1-project-description">{proj.description}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="template1-project-technologies"><strong>Technologies:</strong> {proj.technologies.join(', ')}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="template1-certifications">
          <h2 className="template1-section-heading">Certifications</h2>
          <ul className="template1-certifications-list">
            {certifications.map((cert, idx) => (
              <li key={cert.id || idx} className="template1-certification-item">
                <div className="template1-cert-row1">
                  <span className="template1-cert-name">{cert.name}</span>
                </div>
                <div className="template1-cert-row2">
                  <span className="template1-cert-issuer">{cert.issuer}</span>
                  <span className="template1-cert-date">{formatDate(cert.date)}</span>
                  {cert.credentialId && <span className="template1-cert-credential">Credential ID: {cert.credentialId}</span>}
                  {cert.url && <span className="template1-cert-url"><a href={cert.url} target="_blank" rel="noopener noreferrer">Certificate Link</a></span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {additionalInfo.length > 0 && (
        <section className="template1-additional-info">
          <h2 className="template1-section-heading">Additional Information</h2>
          <ul className="template1-additional-info-list">
            {additionalInfo.map((info, idx) => {
              if (typeof info === 'string') {
                return <li key={idx} className="template1-additional-info-item">{info}</li>;
              } else if (typeof info === 'object' && info !== null) {
                return (
                  <li key={info.id || idx} className="template1-additional-info-item">
                    {info.type && <strong>{info.type}: </strong>}
                    {info.description || JSON.stringify(info)}
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Template1;
