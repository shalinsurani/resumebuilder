// Utility to fill the LaTeX template with resume data
// Usage: fillLatexTemplate(templateString, resumeData)

function escapeLatex(str) {
  if (!str) return '';
  return str
    .replace(/([%$&#_{}~^\\])/g, '\\$1') // Escape LaTeX special chars
    .replace(/\n/g, ' \\ '); // Newlines to LaTeX linebreaks
}

function fillLatexTemplate(template, data) {
  let filled = template;
  filled = filled.replace(/<FULL_NAME>/g, escapeLatex(data.personalInfo?.fullName || ''));
  filled = filled.replace(/<LAST_NAME>/g, escapeLatex(data.personalInfo?.lastName || ''));
  filled = filled.replace(/<JOB_TITLE>/g, escapeLatex(data.personalInfo?.jobRole || ''));
  filled = filled.replace(/<ADDRESS>/g, escapeLatex(data.personalInfo?.address || ''));
  filled = filled.replace(/<CITY>/g, escapeLatex(data.personalInfo?.city || ''));
  filled = filled.replace(/<ZIP>/g, escapeLatex(data.personalInfo?.zip || ''));
  filled = filled.replace(/<PHONE>/g, escapeLatex(data.personalInfo?.phone || ''));
  filled = filled.replace(/<EMAIL>/g, escapeLatex(data.personalInfo?.email || ''));
  filled = filled.replace(/<PORTFOLIO>/g, escapeLatex(data.personalInfo?.portfolio || ''));
  filled = filled.replace(/<LINKEDIN>/g, escapeLatex(data.personalInfo?.linkedin || ''));
  filled = filled.replace(/<SUMMARY>/g, escapeLatex(data.summary || ''));
  filled = filled.replace(/<EXPERIENCE_BLOCKS>/g, (data.experience || []).map(exp => `\\cventry{${escapeLatex(exp.years || '')}}{${escapeLatex(exp.position || '')}}{${escapeLatex(exp.company || '')}}{${escapeLatex(exp.location || '')}}{}{${escapeLatex(exp.description || '')}}`).join('\n'));
  filled = filled.replace(/<EDUCATION_BLOCKS>/g, (data.education || []).map(edu => `\\cventry{${escapeLatex(edu.years || '')}}{${escapeLatex(edu.degree || '')}}{${escapeLatex(edu.institution || '')}}{${escapeLatex(edu.location || '')}}{}{${escapeLatex(edu.details || '')}}`).join('\n'));
  filled = filled.replace(/<SKILLS_BLOCKS>/g, (data.skills && data.skills.length > 0) ? `\\begin{itemize}[leftmargin=*]\n${data.skills.map(skill => `\\item ${escapeLatex(skill.name)}`).join('\n')}\n\\end{itemize}` : '');
  filled = filled.replace(/<PROJECTS_BLOCKS>/g, (data.projects && data.projects.length > 0) ? `\\begin{itemize}[leftmargin=*]\n${data.projects.map(proj => `\\item ${escapeLatex(proj.name)}: ${escapeLatex(proj.description)}`).join('\n')}\n\\end{itemize}` : '');
  filled = filled.replace(/<CERTIFICATIONS_BLOCKS>/g, (data.certifications && data.certifications.length > 0) ? `\\begin{itemize}[leftmargin=*]\n${data.certifications.map(cert => `\\item ${escapeLatex(cert.name)} (${escapeLatex(cert.issuer)})`).join('\n')}\n\\end{itemize}` : '');
  filled = filled.replace(/<ADDITIONAL_INFO_BLOCKS>/g, (data.additionalInfo && data.additionalInfo.length > 0) ? `\\begin{itemize}[leftmargin=*]\n${data.additionalInfo.map(info => `\\item ${escapeLatex(info.type)}: ${escapeLatex(info.description)}`).join('\n')}\n\\end{itemize}` : '');
  return filled;
}

export { fillLatexTemplate };
