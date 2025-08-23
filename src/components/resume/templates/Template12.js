// import React from 'react';
// import './template12.css';

// const Template12 = ({ resumeData }) => {
//   const {
//     personalInfo,
//     summary,
//     experience,
//     education,
//     skills,
//     projects,
//     certifications,
//     additionalInfo
//   } = resumeData;

//   return (
//     <div className="t12-resume-container">
//       <header className="t12-header">
//         <div className="t12-profile-section">
//           {personalInfo?.photoURL && (
//             <div className="t12-photo-container">
//               <img src={personalInfo.photoURL} alt="Profile" className="t12-photo" />
//             </div>
//           )}
//           <div className="t12-header-content">
//             <h1 className="t12-name">{personalInfo?.fullName || 'Full Name'}</h1>
//             <p className="t12-job-title">{personalInfo?.jobRole || 'Professional Title'}</p>
//           </div>
//         </div>
        
//         <div className="t12-contact-info">
//           {personalInfo?.email && (
//             <div className="t12-contact-item">
//               <i className="fas fa-envelope"></i>
//               <span>{personalInfo.email}</span>
//             </div>
//           )}
//           {personalInfo?.phone && (
//             <div className="t12-contact-item">
//               <i className="fas fa-phone-alt"></i>
//               <span>{personalInfo.phone}</span>
//             </div>
//           )}
//           {personalInfo?.linkedin && (
//             <div className="t12-contact-item">
//               <i className="fab fa-linkedin"></i>
//               <span>{personalInfo.linkedin}</span>
//             </div>
//           )}
//           {personalInfo?.portfolio && (
//             <div className="t12-contact-item">
//               <i className="fas fa-globe"></i>
//               <span>{personalInfo.portfolio}</span>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="t12-main-content">
//         <div className="t12-left-column">
//           {summary && (
//             <section className="t12-section">
//               <h2 className="t12-section-title">Professional Summary</h2>
//               <div className="t12-summary-content">
//                 <p>{summary}</p>
//               </div>
//             </section>
//           )}

//           {experience?.length > 0 && (
//             <section className="t12-section">
//               <h2 className="t12-section-title">Work Experience</h2>
//               <div className="t12-experience-list">
//                 {experience.map((exp, index) => (
//                   <div key={index} className="t12-experience-item">
//                     <div className="t12-experience-header">
//                       <h3 className="t12-company-name">{exp.company}</h3>
//                       <span className="t12-position">{exp.position}</span>
//                     </div>
//                     <div className="t12-experience-duration">
//                       <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
//                     </div>
//                     <p className="t12-experience-description">{exp.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {projects?.length > 0 && (
//             <section className="t12-section">
//               <h2 className="t12-section-title">Projects</h2>
//               <div className="t12-projects-list">
//                 {projects.map((project, index) => (
//                   <div key={index} className="t12-project-item">
//                     <div className="t12-project-header">
//                       <h3 className="t12-project-name">{project.name}</h3>
//                       {project.url && (
//                         <a href={project.url} className="t12-project-link" target="_blank" rel="noopener noreferrer">
//                           <i className="fas fa-external-link-alt"></i>
//                         </a>
//                       )}
//                     </div>
//                     <div className="t12-project-technologies">
//                       {project.technologies.map((tech, idx) => (
//                         <span key={idx} className="t12-tech-tag">{tech}</span>
//                       ))}
//                     </div>
//                     <p className="t12-project-description">{project.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
//         </div>

//         <div className="t12-right-column">
//           {skills?.length > 0 && (
//             <section className="t12-section t12-skills-section">
//               <h2 className="t12-section-title">Skills</h2>
//               <div className="t12-skills-list">
//                 {skills.map((skill, index) => (
//                   <span key={index} className="t12-skill-item">{skill}</span>
//                 ))}
//               </div>
//             </section>
//           )}

//           {education?.length > 0 && (
//             <section className="t12-section">
//               <h2 className="t12-section-title">Education</h2>
//               <div className="t12-education-list">
//                 {education.map((edu, index) => (
//                   <div key={index} className="t12-education-item">
//                     <h3 className="t12-degree">{edu.degree}</h3>
//                     <div className="t12-institution">{edu.institution}</div>
//                     <div className="t12-education-duration">
//                       {edu.startDate} - {edu.endDate}
//                     </div>
//                     {edu.description && (
//                       <p className="t12-education-description">{edu.description}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {certifications?.length > 0 && (
//             <section className="t12-section">
//               <h2 className="t12-section-title">Certifications</h2>
//               <div className="t12-certifications-list">
//                 {certifications.map((cert, index) => (
//                   <div key={index} className="t12-certification-item">
//                     <h3 className="t12-cert-name">{cert.name}</h3>
//                     <div className="t12-cert-issuer">{cert.issuer}</div>
//                     <div className="t12-cert-date">{cert.date}</div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {additionalInfo && (
//             <section className="t12-section">
//               <h2 className="t12-section-title">Additional Information</h2>
//               <div className="t12-additional-content">
//                 <p>{additionalInfo}</p>
//               </div>
//             </section>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Template12;

import React from 'react';
import './template12.css';

const Template12 = ({ resumeData = {} }) => {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    additionalInfo = ''
  } = resumeData || {}; // handles null


  return (
    <div className="t12-resume-container">
      <header className="t12-header">
        <div className="t12-profile-section">
          {personalInfo.photoURL && (
            <div className="t12-photo-container">
              <img src={personalInfo.photoURL} alt="Profile" className="t12-photo" />
            </div>
          )}
          <div className="t12-header-content">
            <h1 className="t12-name">{personalInfo.fullName || 'Full Name'}</h1>
            <p className="t12-job-title">{personalInfo.jobRole || 'Professional Title'}</p>
          </div>
        </div>

        <div className="t12-contact-info">
          {personalInfo.email && (
            <div className="t12-contact-item">
              <i className="fas fa-envelope"></i>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="t12-contact-item">
              <i className="fas fa-phone-alt"></i>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="t12-contact-item">
              <i className="fab fa-linkedin"></i>
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="t12-contact-item">
              <i className="fas fa-globe"></i>
              <span>{personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </header>

      <main className="t12-main-content">
        <div className="t12-left-column">
          {summary && (
            <section className="t12-section">
              <h2 className="t12-section-title">Professional Summary</h2>
              <div className="t12-summary-content">
                <p>{summary}</p>
              </div>
            </section>
          )}

          {experience.length > 0 && (
            <section className="t12-section">
              <h2 className="t12-section-title">Work Experience</h2>
              <div className="t12-experience-list">
                {experience.map((exp, index) => (
                  <div key={index} className="t12-experience-item">
                    <div className="t12-experience-header">
                      <h3 className="t12-company-name">{exp.company}</h3>
                      <span className="t12-position">{exp.position}</span>
                    </div>
                    <div className="t12-experience-duration">
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="t12-experience-description">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="t12-section">
              <h2 className="t12-section-title">Projects</h2>
              <div className="t12-projects-list">
                {projects.map((project, index) => (
                  <div key={index} className="t12-project-item">
                    <div className="t12-project-header">
                      <h3 className="t12-project-name">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} className="t12-project-link" target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                      )}
                    </div>
                    <div className="t12-project-technologies">
                      {(project.technologies || []).map((tech, idx) => (
                        <span key={idx} className="t12-tech-tag">{tech}</span>
                      ))}
                    </div>
                    <p className="t12-project-description">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="t12-right-column">
          {skills.length > 0 && (
            <section className="t12-section t12-skills-section">
              <h2 className="t12-section-title">Skills</h2>
              <div className="t12-skills-list">
                {skills.map((skill, index) => (
                  <span key={index} className="t12-skill-item">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="t12-section">
              <h2 className="t12-section-title">Education</h2>
              <div className="t12-education-list">
                {education.map((edu, index) => (
                  <div key={index} className="t12-education-item">
                    <h3 className="t12-degree">{edu.degree}</h3>
                    <div className="t12-institution">{edu.institution}</div>
                    <div className="t12-education-duration">
                      {edu.startDate} - {edu.endDate}
                    </div>
                    {edu.description && (
                      <p className="t12-education-description">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section className="t12-section">
              <h2 className="t12-section-title">Certifications</h2>
              <div className="t12-certifications-list">
                {certifications.map((cert, index) => (
                  <div key={index} className="t12-certification-item">
                    <h3 className="t12-cert-name">{cert.name}</h3>
                    <div className="t12-cert-issuer">{cert.issuer}</div>
                    <div className="t12-cert-date">{cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {additionalInfo && (
            <section className="t12-section">
              <h2 className="t12-section-title">Additional Information</h2>
              <div className="t12-additional-content">
                <p>{additionalInfo}</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Template12;
