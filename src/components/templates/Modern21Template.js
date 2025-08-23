import React from 'react';
import { groupSkillsByCategory, getCategoryDisplayName } from '../../utils/helpers';
import '../../styles/templates/modern21-template.css';

const Modern21Template = ({ 
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
    <div className="modern21-container">
      {/* Header Section */}
      <header className="modern21-header">
        <div className="modern21-header-content">
          <h1 className="modern21-name">{personalInfo?.fullName || 'Your Name'}</h1>
          {personalInfo?.jobRole && <h2 className="modern21-job-title">{personalInfo.jobRole}</h2>}
        </div>
        
        {/* Contact Information */}
        <div className="modern21-contact-section">
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
        {/* First Row: Email */}
        <td style={{ padding: '5px 10px' }}>
          {personalInfo?.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-envelope"></i>
              <span>{personalInfo.email}</span>
            </div>
          )}
        </td>
        {/* First Row: Phone */}
        <td style={{ padding: '5px 10px' }}>
          {personalInfo?.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-phone"></i>
              <span>{personalInfo.phone}</span>
            </div>
          )}
        </td>
        
      </tr>


      <tr>
        {/* Second Row: Address */}
        <td style={{ padding: '5px 10px' }}>
          {personalInfo?.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-map-marker-alt"></i>
              <span>{personalInfo.address}</span>
            </div>
          )}
        </td>
        {/* Second Row: LinkedIn */}
        <td style={{ padding: '5px 10px' }}>
          {personalInfo?.linkedin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fab fa-linkedin"></i>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          )}
        </td>
      </tr>

      {/* Dynamic Rows for Portfolio and Custom Links */}
      {(() => {
        // Create an array of all dynamic links
        const allLinks = [];
        if (personalInfo?.portfolio) {
          allLinks.push({ iconClass: "fas fa-globe", name: "Portfolio", url: personalInfo.portfolio });
        }
        if (personalInfo?.customLinks) {
          allLinks.push(...personalInfo.customLinks.map(link => ({
            iconClass: "fas fa-link",
            name: link.name,
            url: link.url
          })));
        }

        // Generate a new row for every two links
        const rows = [];
        for (let i = 0; i < allLinks.length; i += 2) {
          const firstLink = allLinks[i];
          const secondLink = allLinks[i + 1];

          rows.push(
            <tr key={`link-row-${i}`}>
              <td style={{ padding: '5px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className={firstLink.iconClass}></i>
                  <a href={firstLink.url} target="_blank" rel="noopener noreferrer">{firstLink.name}</a>
                </div>
              </td>
              <td style={{ padding: '5px 10px' }}>
                {secondLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className={secondLink.iconClass}></i>
                    <a href={secondLink.url} target="_blank" rel="noopener noreferrer">{secondLink.name}</a>
                  </div>
                )}
              </td>
            </tr>
          );
        }
        return rows;
      })()}
    </tbody>
  </table>
</div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="modern21-section">
          <h2 className="modern21-section-title" style={{lineHeight:"1.0", wordSpacing:"1px"}}>Professional Summary</h2>
          <p className="modern21-summary" style={{lineHeight:"1.3"}}>{summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="modern21-section">
          <h2 className="modern21-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={exp.id || index} className="modern21-experience-item">
              <div className="modern21-experience-header">
                <h3 className="modern21-company" style={{marginBottom:"-5px"}}>{exp.company} | {exp.position}</h3>
                <span className="modern21-date">
                  {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              {/* <h4 className="modern21-position"></h4> */}
              <div className="modern21-responsibilities">
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
        </section>
      )}

      {/* Education Section */}
            {education && education.length > 0 && (
        <section className="modern21-section">
            <h2 className="modern21-section-title">Education</h2>
            {education.map((edu, index) => (
            <div key={edu.id || index} className="modern21-education-item">
                <div className="modern21-education-header">
                <h3 className="modern21-institution">{edu.institution}</h3>
                <span className="modern21-date">
                    {edu.startDate && new Date(edu.startDate).getFullYear()}
                    {edu.startDate && (edu.endDate || edu.isPresent) && ' - '}
                    {edu.endDate ? new Date(edu.endDate).getFullYear() : (edu.isPresent ? 'Present' : '')}
                </span>
                </div>
                <h4 className="modern21-degree" style={{ fontSize: "0.8em" }}>
                {edu.degree} in {edu.field} - CGPA: {edu.gpa}
                </h4>
            </div>
            ))}
        </section>
        )}

      {/* Skills Section */}
      {skills && skills.length > 0 && Object.keys(skillsByCategory).length > 0 && (
        <section className="modern21-section">
          <h2 className="modern21-section-title">Skills</h2>
          <div className="modern21-skills-container">
            {Object.keys(skillsByCategory).map((category) => (
              <div key={category} className="modern21-skill-category">
                <h3 className="modern21-skill-category-title">{getCategoryDisplayName(category)}</h3>
                <div className="modern21-skills-list">
                  {skillsByCategory[category].map((skill) => (
                    <span key={skill.id} className="modern21-skill-item">
                      {skill.name}
                      {skill.level && skill.level !== 'Beginner' && ` (${skill.level})`}
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
        <section className="modern21-section">
          <h2 className="modern21-section-title">Projects</h2>
          {projects.map((project, index) => (
            <div key={project.id || index} className="modern21-project-item">
              <div className="modern21-project-header">
                <h3 className="modern21-project-name">{project.name}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="modern21-project-link">
                    <i className="fas fa-external-link-alt"></i> View Project
                  </a>
                )}
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <p className="modern21-project-tech">
                  <strong>Technologies:</strong> {project.technologies.join(', ')}
                </p>
              )}
              <div className="modern21-project-description">
                {project.description && (
                  <ul>
                    {project.description.split('\n').map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications Section */}
     {certifications && certifications.length > 0 && (
  <section className="modern21-section">
    <h2 className="modern21-section-title">Certifications</h2>
    {certifications.map((cert, index) => (
      <div key={cert.id || index} className="modern21-certification-item">
        <div className="modern21-certification-header">
          <h3 className="modern21-certification-name">{cert.name} - {cert.issuer}</h3>
          <span className="modern21-date">
            {cert.date && new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </span>
        </div>
        {/* Only display if BOTH credentialId and url exist */}
        {cert.credentialId && cert.url && (
          <p className="modern21-credential-id">
            Credential ID: {cert.credentialId} - 
            <a href={cert.url} target="_blank" rel="noopener noreferrer"> View Credential</a>
          </p>
        )}
        {/* If only credentialId exists, display it without the link */}
        {cert.credentialId && !cert.url && (
          <p className="modern21-credential-id">
            Credential ID: {cert.credentialId}
          </p>
        )}
      </div>
    ))}
  </section>
)}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <section className="modern21-section">
          <h2 className="modern21-section-title">Additional Information</h2>
          {additionalInfo.map((info, index) => (
            // <div key={index} className="modern21-additional-info-item">
            //   <h3 className="modern21-additional-info-type">{info.type} | {info.description}</h3>
              
            // </div>

            <div key={index} className="corp-additional-info-item" style={{fontSize:"0.8em"}}>
              <span className="info-type" style={{fontWeight:"bold"}}>{info.type}</span>
              <span className="info-description"> | {info.description}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Modern21Template;


