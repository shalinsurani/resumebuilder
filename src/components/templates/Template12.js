import React from 'react';
import '../../styles/templates/template12.css';
import { groupSkillsByCategory, getCategoryDisplayName } from '../../utils/helpers';

const Template12 = (props) => {
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = [], projects = [], certifications = [], additionalInfo = [] } = props || {};
  return (
    <div className="t12-container">
      <header className="t12-header">
        {personalInfo.photoURL && (
          <div className="t12-photo-container">
            <img src={personalInfo.photoURL} alt="Profile" className="t12-photo" />
          </div>
        )}
        <div className="t12-header-content">
          <h1 className="t12-name">{personalInfo.fullName || 'Full Name'}</h1>
          <div className="t12-contact-info">
            <p>📧 {personalInfo.email}</p>
            <p>📞 {personalInfo.phone}</p>
            <p>📍 {personalInfo.address}</p>
            {personalInfo.linkedin && <p>💼 {personalInfo.linkedin}</p>}
            {personalInfo.portfolio && <p>🌐 {personalInfo.portfolio}</p>}
          </div>
        </div>
      </header>

      {summary && (
        <section className="t12-section">
          <h2 className="t12-section-title">Professional Summary</h2>
          <p className="t12-summary" style={{marginBottom:"5px"}}>{summary}</p>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="t12-section">
          <h2 className="t12-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="t12-experience-item">
              <div className="t12-experience-header">
                <h3 className="t12-company">{exp.company || 'Company Name'} | {exp.position || 'Position'}</h3>
                <span className="t12-date">{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              {exp.description && (
                <p className="t12-experience-description">{exp.description}</p>
              )}
              <ul className="t12-responsibilities">
                {(exp.responsibilities || []).map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education && education.length > 0 && (
        <section className="t12-section">
          <h2 className="t12-section-title" style={{marginTop:"15px"}}>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="t12-education-item">
              <div className="t12-education-header">
                <h3 className="t12-institution">{edu.institution || 'Institution Name'}</h3>
                <span className="t12-date">{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
              <p className="t12-degree">{edu.degree || 'Degree'} in {edu.field}</p>
              {edu.description && <p className="t12-description">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="t12-section">
          <h2 className="t12-section-title" style={{marginTop:"15px"}}>Skills</h2>
          {Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => (
            <div key={category} className="t12-skill-category">
              <h3 className="t12-category-title">{getCategoryDisplayName(category)}</h3>
              <div className="t12-skills-container">
                {categorySkills.map((skill, index) => (
                  <div key={index} className="t12-skill-item">
                    <span className="t12-skill-name">{skill.name}</span>
                    {/* {skill.level && <span className="t12-skill-level">({skill.level})</span>} */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="t12-section">
          <h2 className="t12-section-title">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="t12-project-item">
              <h3 className="t12-project-title">{project.name || 'Project Name'}</h3>
              <p className="t12-project-description">{project.description || 'Project Description'}</p>
              {project.technologies && (
                <p className="t12-project-tech">
                  <strong>Technologies:</strong> {(project.technologies || []).join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {certifications && certifications.length > 0 && (
        <section className="t12-section">
          <h2 className="t12-section-title">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="t12-certification-item">
              <h3 className="t12-cert-name">{cert.name || 'Certification Name'} -- {cert.issuer || 'Issuer'}</h3>
              {/* <p className="t12-cert-issuer">{cert.issuer || 'Issuer'}</p> */}
              {cert.date && <span className="t12-date">{cert.date}</span>}
              {cert.description && <p className="t12-description">{cert.description}</p>}
            </div>
          ))}
        </section>
      )}

      {additionalInfo && additionalInfo.length > 0 && (
        <section className="t12-section">
          <h2 className="t12-section-title">Additional Information</h2>
          {additionalInfo.map((info, index) => (
            <div key={index} className="t12-additional-item">
              <h3 className="t12-additional-type">{info.type}</h3>
              <p className="t12-additional-description">{info.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Template12;
