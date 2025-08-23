import React from 'react';
import '../../styles/templates/professional2-template.css';
import { groupSkillsByCategory, getCategoryDisplayName, formatDate } from '../../utils/helpers';

const Professional2Template = ({
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
    <div className="professional2-resume">
      <header className="resume-header">
        {personalInfo.photoURL && (
          <div className="photo-section">
            <img src={personalInfo.photoURL} alt="Profile" className="profile-photo" />
          </div>
        )}
        <h1>{personalInfo.fullName}</h1>
        {personalInfo.jobRole && <h2 className="job-title">{personalInfo.jobRole}</h2>}
        <div className="contact-info">
          {personalInfo.email && <span>📧 <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.address && <span>📍 {personalInfo.address}</span>}
          {personalInfo.linkedin && <span>🔗 <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
          {personalInfo.portfolio && <span>🌐 <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
        </div>
      </header>

      {summary && (
        <section className="profile-summary" style={{ marginTop: 0 }}>
          <div className="section-header">Professional Summary</div>
          <p>{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="experience">
          <div className="section-header">Experience</div>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="experience-item">
              <div className="experience-header" style={{ marginBottom: 0 }}>
                <h7 style={{ display: 'inline', marginRight: 8 , fontWeight: "600"}}>{exp.position} </h7> <br />
                <span style={{ display: 'inline' }}>{exp.company}{exp.company && (exp.startDate || exp.endDate) ? ' ' : ''}{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              {exp.description && (
                <ul className="experience-description">
                  {exp.description.split('\n').map((item, i) => (
                    item.trim() && <li key={i}>{item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="education">
          <div className="section-header">Education</div>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="education-item">
              <div className="education-header">
                <div>
                  <span style={{ fontWeight: 600 }}>{edu.degree}</span>
                  {edu.field && <span> in {edu.field}</span>}
                </div>
                <div>
                  <span>{edu.institution}</span>
                  {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                  <span style={{ float: 'right' }}>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="skills">
          <div className="section-header">Skills</div>
          <div className="skills-categories">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="skill-category">
                <h4>{getCategoryDisplayName(category)}</h4>
                <span>{categorySkills.map((skill, i) => skill.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="projects">
          <div className="section-header">Projects</div>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="project-item">
              <div>
                <span style={{ fontWeight: 600 }}>{proj.name}</span>
              </div>
              <div className="project-description">
                <span>{proj.description}</span>
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div style={{ fontWeight: 600 }}>Technologies : {proj.technologies.join(', ')}</div>
              )}
              {proj.url && <div><a href={proj.url} target="_blank" rel="noopener noreferrer">Project Link</a></div>}
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="certifications">
          <div className="section-header">Certifications</div>
          {certifications.map((cert, idx) => (
            <div key={cert.id || idx} className="certification-item">
              <div>
                <span style={{ fontWeight: 600 }}>{cert.name}</span>
              </div>
              <div>
                <span>{cert.issuer}</span>
                <span style={{ marginLeft: 8 }}>{formatDate(cert.date)}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {additionalInfo.length > 0 && (
        <section className="additional-info">
          <div className="section-header">Additional Information</div>
          <ul>
            {additionalInfo.map((info, idx) => {
              if (typeof info === 'string') {
                return <li key={idx} style={{ fontSize: '0.8em' }}>{info}</li>;
              } else if (typeof info === 'object' && info !== null) {
                // Render object fields (type, description, etc.)
                return (
                  <li key={info.id || idx} style={{ fontSize: '0.8em' }}>
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

export default Professional2Template;
