// import React from 'react';
// import { formatDate, groupSkillsByCategory, formatSkillsForDisplay, getCategoryDisplayName } from '../../utils/helpers';

// const ProfessionalTemplate = ({ personalInfo, summary, experience, education, skills, projects, certifications }) => {
//   return (
//     <div className="resume-template professional-template">
//       {/* Header Section with Photo */}
//       <div className="resume-header">
//         <div className="header-left">
//           {personalInfo.photoURL && (
//             <div className="photo-container">
//               <img src={personalInfo.photoURL} alt="Profile" className="profile-photo" />
//             </div>
//           )}
//         </div>
//         <div className="header-right">
//           <h1 className="name">{personalInfo.fullName}</h1>
//           {personalInfo.jobRole && <h2 className="job-title">{personalInfo.jobRole}</h2>}
//           <div className="contact-info">
//             <div className="contact-row">
//               <span className="contact-label">Address:</span>
//               <span>{personalInfo.address || '123 Anywhere St., Any City'}</span>
//             </div>
//             <div className="contact-row">
//               <span className="contact-label">Phone:</span>
//               <span>{personalInfo.phone || '123-456-7890'}</span>
//             </div>
//             <div className="contact-row">
//               <span className="contact-label">Email:</span>
//               <span>{personalInfo.email}</span>
//             </div>
//             {personalInfo.portfolio && (
//               <div className="contact-row">
//                 <span className="contact-label">Website:</span>
//                 <span>{personalInfo.portfolio}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Summary Section */}
//       {summary && (
//         <div className="resume-section summary-section">
//           <h2 className="section-title">SUMMARY</h2>
//           <p className="summary-text">{summary}</p>
//         </div>
//       )}

//       {/* Experience Section */}
//       {experience && experience.length > 0 && (
//         <div className="resume-section experience-section">
//           <h2 className="section-title">WORK EXPERIENCE</h2>
//           {experience.map((exp, index) => (
//             <div key={index} className="experience-item">
//               <div className="experience-header">
//                 <div className="job-info">
//                   <h3 className="job-title">{exp.jobTitle}, {exp.company}</h3>
//                   <span className="date-range">
//                     {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
//                   </span>
//                 </div>
//               </div>
//               {exp.description && (
//                 <ul className="experience-description">
//                   {exp.description.split('\n').map((item, i) => (
//                     item.trim() && <li key={i}>{item.trim()}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Education Section */}
//       {education && education.length > 0 && (
//         <div className="resume-section education-section">
//           <h2 className="section-title">EDUCATION</h2>
//           {education.map((edu, index) => (
//             <div key={index} className="education-item">
//               <div className="education-header">
//                 <h3 className="degree">{edu.degree} with Honours</h3>
//                 <span className="date-range">
//                   {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
//                 </span>
//               </div>
//               <div className="school-info">
//                 <span className="school">{edu.school}</span>
//                 {edu.gpa && <span className="gpa"> • GPA: {edu.gpa}</span>}
//               </div>
//               <ul className="education-details">
//                 <li>Major in {edu.degree.split(' ')[0]} Technology.</li>
//                 <li>Thesis on "Technological Advancements within the current {edu.degree.split(' ')[0]} Industry".</li>
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Additional Information Section */}
//       <div className="resume-section additional-section">
//         <h2 className="section-title">ADDITIONAL INFORMATION</h2>

//         {/* Skills by Category */}
//         {skills && skills.length > 0 && (
//           <div className="skills-categories">
//             {Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => (
//               <div key={category} className="info-subsection">
//                 <h4 className="subsection-title">{getCategoryDisplayName(category)}:</h4>
//                 <p className="skills-text">
//                   {formatSkillsForDisplay(categorySkills)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Languages */}
//         <div className="info-subsection">
//           <h4 className="subsection-title">Languages:</h4>
//           <p>English, Hindi, Japan</p>
//         </div>

//         {/* Certifications */}
//         {certifications && certifications.length > 0 && (
//           <div className="info-subsection">
//             <h4 className="subsection-title">Certifications:</h4>
//             <p>
//               {certifications.map(cert => `${cert.name} (${cert.issuer})`).join(', ')}
//             </p>
//           </div>
//         )}
//       </div>


//     </div>
//   );
// };

// export default ProfessionalTemplate;

import React from 'react';
import {
  formatDate,
  groupSkillsByCategory,
  formatSkillsForDisplay,
  getCategoryDisplayName
} from '../../utils/helpers';

const CleanMinimalTemplate = ({
  personalInfo,
  summary,
  experience,
  education,
  skills,
  projects,
  certifications,
  additionalInfo
}) => {
  return (
    <div className="resume-template clean-minimal-template">
      {/* Inline Styling */}
      <style>
        {`
          .resume-template.clean-minimal-template {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #111;
            max-width: 800px;
            margin: auto;
            padding: 20px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid #aaa;
            margin-bottom: 10px;
            padding-bottom: 5px;
          }

          .header .name {
            font-size: 18pt;
            margin: 0;
          }

          .header .subtitle {
            font-size: 10pt;
            margin-top: 2px;
            color: #555;
          }

          .header .right p {
            margin: 2px 0;
            font-size: 9.5pt;
          }

          .section-title {
            font-size: 10.5pt;
            font-weight: bold;
            margin: 12px 0 4px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2px;
          }

          .item {
            margin-bottom: 6px;
          }

          .item p {
            margin: 2px 0;
          }

          .date {
            font-size: 9pt;
            color: #555;
          }

          ul {
            padding-left: 18px;
            margin: 4px 0;
          }

          ul li {
            margin-bottom: 2px;
            font-size: 9.5pt;
          }

          .skills .skill-category {
            margin: 4px 0;
          }

          .skills em {
            font-style: italic;
            color: #333;
          }

          @media print {
            body {
              margin: 0;
            }
            .resume-template {
              page-break-inside: avoid;
            }
          }
        `}
      </style>

      {/* Header Section */}
      <div className="header">
        <div className="left">
          <h1 className="name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="subtitle">{personalInfo.jobRole || 'Anti Curriculum Vitae'}</p>
        </div>
        <div className="right">
          <p><strong>Phone:</strong> {personalInfo.phone}</p>
          <p><strong>Email:</strong> {personalInfo.email}</p>
          {personalInfo.portfolio && <p><strong>Website:</strong> {personalInfo.portfolio}</p>}
          {personalInfo.github && <p><strong>GitHub:</strong> {personalInfo.github}</p>}
        </div>
      </div>

      {/* KEY Section */}
      {summary && (
        <section>
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary">{summary}</p>
        </section>
      )}

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <section>
          <h2 className="section-title">EDUCATION</h2>
          {education.map((edu, index) => (
            <div className="item" key={index}>
              <p><strong>{edu.school}</strong>{edu.institution} - {edu.degree}  </p>
              {/* <p><strong>{edu.school}</strong>{edu.degree}</p> */}
              {/* <p className="date">{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</p> */}
              {edu.gpa && <p>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* WORK EXPERIENCE */}
      {experience && experience.length > 0 && (
        <section>
          <h2 className="section-title">WORK EXPERIENCE</h2>
          {experience.map((exp, index) => (
            <div className="item" key={index}>
              <p><strong>{exp.jobTitle}</strong> — {exp.company}</p>
              <p className="date">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
              {exp.description && (
                <ul>
                  {exp.description.split('\n').map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="section-title">SKILLS</h2>
          <div className="skills">
            {Object.entries(groupSkillsByCategory(skills)).map(([category, skillSet]) => (
              <div key={category} className="skill-category">
                <p><em>{getCategoryDisplayName(category)}</em> — {formatSkillsForDisplay(skillSet)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS AND INTERESTS */}
      {(projects.length > 0 || certifications.length > 0) && (
        <section>
          <h2 className="section-title">ACHIEVEMENTS AND INTERESTS</h2>
          {projects.map((project, index) => (
            <div key={index} className="item">
              <p><strong>{project.title}</strong> — {project.description}</p>
            </div>
          ))}
          {certifications.length > 0 && (
            <div className="item">
              <p><strong>Certifications:</strong> {certifications.map(cert => `${cert.name} (${cert.issuer})`).join(', ')}</p>
            </div>
          )}
        </section>
      )}

      {/* Additional Information Section */}
      {additionalInfo && additionalInfo.length > 0 && (
        <section>
          <h2 className="section-title">ADDITIONAL INFORMATION</h2>
          {additionalInfo.map((info, index) => (
            <div key={index} className="item">
              <p><strong>{info.type}:</strong> {info.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default CleanMinimalTemplate;
