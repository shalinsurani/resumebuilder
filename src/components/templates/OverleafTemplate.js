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
        <div style={{alignItems:"center", alignContent:"center"}}
        className="ol-contact">
          {personalInfo?.jobRole && <span><i className="fas fa-briefcase"></i> {personalInfo.jobRole}</span>}
          {personalInfo?.email && <span><i className="fas fa-envelope"></i> {personalInfo.email}</span>}
          {personalInfo?.phone && <span><i className="fas fa-phone"></i> {personalInfo.phone}</span>}
          {personalInfo?.address && <span><i className="fas fa-map-marker-alt"></i> {personalInfo.address}</span>}
          {personalInfo?.portfolio && <span><i className="fas fa-globe"></i> <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
          {personalInfo?.customLinks && personalInfo.customLinks.map((link, idx) => (
            <span key={idx}><i className="fas fa-link"></i> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a></span>
          ))}
          {personalInfo?.linkedin && <span><i className="fab fa-linkedin"></i> <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
          {personalInfo?.github && <span><i className="fab fa-github"></i> <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a></span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="ol-section">
          <h2 className="ol-section-title">Profile Summary</h2>
          <div className="ol-section-content summary1">{summary}</div>
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
                  <span className="ol-date">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="ol-row">
                  <span style={{fontSize: "0.7em"}}>{edu.degree} in {edu.field} {edu.stream ? `, ${edu.stream}` : ''}</span>
                  {edu.gpa && <span style={{fontSize: "0.7em"}}>CGPA: {edu.gpa}</span>}
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
                  <span className="ol-date">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <div className="ol-row">
                  <span style={{fontSize: "0.8em"}}>{exp.position}</span>
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
              <div key={category}>
                <span className="ol-bold">{getCategoryDisplayName(category)}:</span>{' '}
                {groupedSkills[category]
                  .map(skill => skill.name)
                  .filter(Boolean)
                  .map((name, i, arr) => (
                    <span key={i} className="ol-skill-name">
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
        <div className="ol-section">
          <h2 className="ol-section-title">Additional Information</h2>
          <ul className="ol-list">
            {additionalInfo.map((info, idx) => (
              <li key={idx} className="ol-list-item">
                <div className="ol-row">
                  <span className="ol-bold">{info.type}</span>
                </div>
                <div className="ol-row">
                  <span style={{fontSize: "0.7em"}}>{info.description}</span>
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
                  <span style={{fontSize: "0.7em"}}>{cert.issuer}</span>
                </div>
                <div className="ol-row">
                  <span style={{fontSize: "0.7em"}}>{cert.date}</span>
                  {cert.url && <a style={{fontSize:"0.7em"}} href={cert.url} target="_blank" rel="noopener noreferrer">Verify</a>}
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
