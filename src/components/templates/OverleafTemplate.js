import React from 'react';
import './overleaf-template.css';
import { groupSkillsByCategory, getCategoryDisplayName } from '../../utils/helpers';

const OverleafTemplate = ({ personalInfo, summary, education, experience, projects, skills, certifications, achievements, additionalInfo }) => {
  const groupedSkills = groupSkillsByCategory(skills);
  return (
    <div className="resume-template overleaf-template">
      {/* Header Section */}
      <div className="ol-header">
        <h1 className="ol-name">{personalInfo?.fullName}</h1>
        <div className="ol-contact">
          {personalInfo?.jobRole && <span><i className="fas fa-briefcase"></i> {personalInfo.jobRole}</span>}
          {personalInfo?.email && <span><i className="fas fa-envelope"></i> {personalInfo.email}</span>}
          {personalInfo?.phone && <span><i className="fas fa-phone"></i> {personalInfo.phone}</span>}
          {personalInfo?.address && <span><i className="fas fa-map-marker-alt"></i> {personalInfo.address}</span>}
          {personalInfo?.portfolio && <span><i className="fas fa-globe"></i> <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
          {personalInfo?.linkedin && <span><i className="fab fa-linkedin"></i> <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
          {personalInfo?.github && <span><i className="fab fa-github"></i> <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a></span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="ol-section">
          <h2 className="ol-section-title">Profile Summary</h2>
          <div className="ol-section-content">{summary}</div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Education</h2>
          <ul className="ol-list">
            {education.map((edu, idx) => (
              <li key={idx} className="ol-list-item">
                <div className="ol-row">
                  <span className="ol-bold">{edu.institution}</span>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="ol-row">
                  <span>{edu.degree}{edu.stream ? `, ${edu.stream}` : ''}</span>
                  {edu.gpa && <span>CGPA: {edu.gpa}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Achievements</h2>
          <ul className="ol-list">
            {achievements.map((ach, idx) => (
              <li key={idx} className="ol-list-item">{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Experience</h2>
          <ul className="ol-list">
            {experience.map((exp, idx) => (
              <li key={idx} className="ol-list-item">
                <div className="ol-row">
                  <span className="ol-bold">{exp.company}</span>
                  <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <div className="ol-row">
                  <span>{exp.position}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && <div className="ol-desc">{exp.description}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Notable Projects</h2>
          <ul className="ol-list">
            {projects.map((proj, idx) => (
              <li key={idx} className="ol-list-item">
                <div className="ol-row">
                  <span className="ol-bold">{proj.name}</span>
                  <span>{proj.date}</span>
                </div>
                <div className="ol-row">
                  <span>{proj.role}</span>
                </div>
                {proj.description && <div className="ol-desc">{proj.description}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}


      {/* Skills - Grouped by Category */}
      {skills && skills.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Skills</h2>
          <div className="ol-section-content ol-skills">
            {Object.keys(groupedSkills).map((category, idx) => (
              <div key={category} style={{ marginBottom: '2px' }}>
                <span className="ol-bold">{getCategoryDisplayName(category)}:</span> {groupedSkills[category].map(skill => skill.name).filter(Boolean).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {additionalInfo && additionalInfo.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Additional Information</h2>
          <ul className="ol-list">
            {additionalInfo.map((info, idx) => (
              <li key={idx} className="ol-list-item">
                <div className="ol-row">
                  <span className="ol-bold">{info.type}</span>
                </div>
                <div className="ol-row">
                  <span>{info.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="ol-section">
          <h2 className="ol-section-title">Certifications</h2>
          <ul className="ol-list">
            {certifications.map((cert, idx) => (
              <li key={idx} className="ol-list-item">
                <div className="ol-row">
                  <span className="ol-bold">{cert.name}</span>
                  <span>{cert.issuer}</span>
                </div>
                <div className="ol-row">
                  <span>{cert.date}</span>
                  {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer">Verify</a>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OverleafTemplate;
