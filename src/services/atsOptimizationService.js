/**
 * ATS Optimization Service
 * Enhances resume content with industry-specific keywords and formatting
 */

// Industry-specific keywords for ATS optimization
const INDUSTRY_KEYWORDS = {
  'software': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Agile', 'Scrum', 'CI/CD', 'Git', 'API', 'Database', 'Full-stack', 'Frontend', 'Backend'],
  'data': ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Tableau', 'Power BI', 'Statistics', 'R', 'Pandas', 'NumPy', 'TensorFlow', 'Big Data', 'ETL', 'Data Visualization'],
  'marketing': ['Digital Marketing', 'SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing', 'Email Marketing', 'CRM', 'Lead Generation', 'Conversion Rate', 'ROI', 'KPI'],
  'finance': ['Financial Analysis', 'Excel', 'Financial Modeling', 'Budgeting', 'Forecasting', 'Risk Management', 'Compliance', 'Audit', 'GAAP', 'Financial Reporting', 'Variance Analysis'],
  'sales': ['Sales Management', 'Lead Generation', 'CRM', 'Salesforce', 'Pipeline Management', 'Revenue Growth', 'Client Relationship', 'Negotiation', 'Quota Achievement', 'B2B Sales'],
  'project': ['Project Management', 'PMP', 'Agile', 'Scrum', 'Kanban', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'Timeline Management', 'Resource Planning'],
  'hr': ['Human Resources', 'Talent Acquisition', 'Employee Relations', 'Performance Management', 'HRIS', 'Compensation', 'Benefits', 'Training', 'Compliance', 'Diversity'],
  'operations': ['Operations Management', 'Process Improvement', 'Lean Six Sigma', 'Supply Chain', 'Logistics', 'Quality Assurance', 'Cost Reduction', 'Efficiency', 'KPI', 'Vendor Management']
};

// Strong action verbs for resume optimization
const ACTION_VERBS = [
  'Achieved', 'Accelerated', 'Accomplished', 'Administered', 'Analyzed', 'Architected',
  'Built', 'Collaborated', 'Coordinated', 'Created', 'Delivered', 'Designed', 'Developed',
  'Directed', 'Enhanced', 'Established', 'Executed', 'Generated', 'Implemented', 'Improved',
  'Increased', 'Initiated', 'Launched', 'Led', 'Managed', 'Optimized', 'Orchestrated',
  'Organized', 'Pioneered', 'Reduced', 'Resolved', 'Spearheaded', 'Streamlined', 'Transformed'
];

// Quantifiable metrics templates
const METRICS_TEMPLATES = [
  '% increase in efficiency',
  '% reduction in costs',
  '% improvement in performance',
  '% growth in revenue',
  '% increase in customer satisfaction',
  'team of X members',
  'budget of $X',
  'X+ users/customers',
  'X% faster delivery',
  'X hours saved per week'
];

/**
 * Detect industry based on job title and skills
 * @param {string} jobTitle - The job title
 * @param {Array} skills - Array of skills
 * @returns {string} - Detected industry
 */
export const detectIndustry = (jobTitle = '', skills = []) => {
  const title = jobTitle.toLowerCase();
  const skillsText = skills.join(' ').toLowerCase();
  
  if (title.includes('developer') || title.includes('engineer') || title.includes('programmer') || 
      skillsText.includes('javascript') || skillsText.includes('python') || skillsText.includes('react')) {
    return 'software';
  }
  
  if (title.includes('data') || title.includes('analyst') || title.includes('scientist') ||
      skillsText.includes('sql') || skillsText.includes('tableau') || skillsText.includes('analytics')) {
    return 'data';
  }
  
  if (title.includes('marketing') || title.includes('digital') || title.includes('seo') ||
      skillsText.includes('marketing') || skillsText.includes('seo') || skillsText.includes('social media')) {
    return 'marketing';
  }
  
  if (title.includes('finance') || title.includes('accounting') || title.includes('financial') ||
      skillsText.includes('excel') || skillsText.includes('financial') || skillsText.includes('budget')) {
    return 'finance';
  }
  
  if (title.includes('sales') || title.includes('business development') ||
      skillsText.includes('sales') || skillsText.includes('crm') || skillsText.includes('salesforce')) {
    return 'sales';
  }
  
  if (title.includes('project manager') || title.includes('program manager') ||
      skillsText.includes('project management') || skillsText.includes('agile') || skillsText.includes('scrum')) {
    return 'project';
  }
  
  if (title.includes('hr') || title.includes('human resources') || title.includes('recruiter') ||
      skillsText.includes('hr') || skillsText.includes('recruiting') || skillsText.includes('talent')) {
    return 'hr';
  }
  
  if (title.includes('operations') || title.includes('supply chain') || title.includes('logistics') ||
      skillsText.includes('operations') || skillsText.includes('process') || skillsText.includes('logistics')) {
    return 'operations';
  }
  
  return 'software'; // Default fallback
};

/**
 * Get relevant keywords for detected industry
 * @param {string} industry - The detected industry
 * @returns {Array} - Array of relevant keywords
 */
export const getIndustryKeywords = (industry) => {
  return INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS['software'];
};

/**
 * Enhance content with ATS-optimized keywords and formatting
 * @param {string} content - Original content
 * @param {string} industry - Target industry
 * @param {string} contentType - Type of content (summary, experience, project)
 * @returns {string} - Enhanced content
 */
export const enhanceContentForATS = (content, industry, contentType = 'general') => {
  if (!content) return content;
  
  let enhancedContent = content;
  const keywords = getIndustryKeywords(industry);
  
  // Add industry-specific keywords naturally
  if (contentType === 'summary' && !keywords.some(keyword => 
    enhancedContent.toLowerCase().includes(keyword.toLowerCase()))) {
    const relevantKeywords = keywords.slice(0, 3).join(', ');
    enhancedContent = enhancedContent.replace(
      /\.$/, 
      ` with expertise in ${relevantKeywords}.`
    );
  }
  
  // Enhance action verbs
  const weakVerbs = ['did', 'worked', 'helped', 'was responsible', 'handled'];
  weakVerbs.forEach(weakVerb => {
    if (enhancedContent.toLowerCase().includes(weakVerb)) {
      const strongVerb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
      enhancedContent = enhancedContent.replace(
        new RegExp(weakVerb, 'gi'), 
        strongVerb
      );
    }
  });
  
  return enhancedContent;
};

/**
 * Calculate ATS score based on content analysis
 * @param {Object} resumeData - Complete resume data
 * @returns {Object} - ATS score and recommendations
 */
export const calculateATSScore = (resumeData) => {
  let score = 0;
  const recommendations = [];
  
  const { personalInfo, experience, education, skills, summary } = resumeData;
  const industry = detectIndustry(personalInfo?.jobTitle, skills);
  const industryKeywords = getIndustryKeywords(industry);
  
  // Check for industry keywords (30 points)
  const allText = `${summary || ''} ${JSON.stringify(experience || [])} ${JSON.stringify(skills || [])}`.toLowerCase();
  const keywordMatches = industryKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  ).length;
  
  const keywordScore = Math.min((keywordMatches / industryKeywords.length) * 30, 30);
  score += keywordScore;
  
  if (keywordScore < 15) {
    recommendations.push(`Add more ${industry} industry keywords: ${industryKeywords.slice(0, 5).join(', ')}`);
  }
  
  // Check for quantifiable achievements (25 points)
  const hasNumbers = /\d+%|\$\d+|\d+\+|\d+ (years|months|members|users|customers)/.test(allText);
  if (hasNumbers) {
    score += 25;
  } else {
    recommendations.push('Add quantifiable achievements with specific numbers and percentages');
  }
  
  // Check for action verbs (20 points)
  const actionVerbCount = ACTION_VERBS.filter(verb => 
    allText.includes(verb.toLowerCase())
  ).length;
  
  const actionScore = Math.min((actionVerbCount / 5) * 20, 20);
  score += actionScore;
  
  if (actionScore < 10) {
    recommendations.push('Use more strong action verbs: Led, Managed, Developed, Implemented, Achieved');
  }
  
  // Check for education and skills (15 points)
  if (education && education.length > 0) score += 8;
  if (skills && skills.length >= 5) score += 7;
  
  if (!education || education.length === 0) {
    recommendations.push('Add education information');
  }
  if (!skills || skills.length < 5) {
    recommendations.push('Add more relevant skills (minimum 5 recommended)');
  }
  
  // Check for professional summary (10 points)
  if (summary && summary.length > 50) {
    score += 10;
  } else {
    recommendations.push('Add a comprehensive professional summary');
  }
  
  return {
    score: Math.round(score),
    industry,
    recommendations: recommendations.slice(0, 5), // Top 5 recommendations
    keywordMatches,
    totalKeywords: industryKeywords.length
  };
};

export default {
  detectIndustry,
  getIndustryKeywords,
  enhanceContentForATS,
  calculateATSScore,
  ACTION_VERBS,
  METRICS_TEMPLATES
};
