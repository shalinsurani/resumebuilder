/**
 * Industry-Specific Templates Service
 * Provides relevant, dynamic content templates for different industries and roles
 */

// Role-specific experience templates
const EXPERIENCE_TEMPLATES = {
  'software': [
    '• Developed scalable web applications using React, Node.js, and MongoDB, serving 25,000+ active users with 99.9% uptime\n• Implemented CI/CD pipelines and automated testing frameworks, reducing deployment time by 60% and bug reports by 40%\n• Led code reviews and mentored 4 junior developers, improving team code quality and development velocity by 35%\n• Optimized database queries and API performance, achieving 50% faster response times and enhanced user experience',
    
    '• Architected microservices infrastructure using Docker and Kubernetes, supporting 100,000+ concurrent users\n• Built RESTful APIs and integrated third-party services, enabling seamless data flow across 5 different platforms\n• Collaborated with product managers and UX designers to deliver features that increased user engagement by 45%\n• Established coding standards and best practices, reducing technical debt by 30% and improving maintainability'
  ],
  
  'data': [
    '• Analyzed large datasets using Python, SQL, and Tableau, identifying trends that led to $500K in cost savings\n• Built machine learning models for predictive analytics, achieving 92% accuracy and improving forecasting by 25%\n• Created automated reporting dashboards serving 50+ stakeholders, reducing manual analysis time by 70%\n• Collaborated with business teams to translate data insights into actionable strategies, driving 15% revenue growth',
    
    '• Designed ETL pipelines processing 10M+ records daily using Apache Spark and AWS, ensuring 99.8% data accuracy\n• Developed statistical models and A/B testing frameworks, optimizing conversion rates by 20% across 3 products\n• Implemented data governance policies and quality controls, reducing data inconsistencies by 85%\n• Presented findings to C-level executives, influencing strategic decisions worth $2M+ in investments'
  ],
  
  'marketing': [
    '• Executed digital marketing campaigns across Google Ads and Facebook, generating $1.2M in revenue with 4:1 ROI\n• Managed SEO strategy and content optimization, increasing organic traffic by 150% and improving search rankings\n• Analyzed customer data and behavior patterns, developing targeted campaigns that improved conversion rates by 35%\n• Coordinated with creative and development teams to launch 12+ successful product campaigns on schedule',
    
    '• Led social media strategy across 5 platforms, growing follower base by 200% and engagement rates by 80%\n• Implemented marketing automation workflows using HubSpot, nurturing 10,000+ leads and improving sales qualified leads by 45%\n• Conducted market research and competitive analysis, identifying opportunities that resulted in 3 new product launches\n• Managed $500K annual marketing budget, optimizing spend allocation and achieving 25% cost reduction while maintaining performance'
  ],
  
  'finance': [
    '• Performed financial analysis and modeling for $50M+ investment portfolio, identifying opportunities that generated 18% returns\n• Prepared monthly financial reports and variance analysis, providing insights that improved budget accuracy by 30%\n• Led audit coordination and compliance initiatives, ensuring 100% regulatory adherence and zero findings\n• Streamlined accounts payable processes using automation tools, reducing processing time by 40% and errors by 60%',
    
    '• Managed corporate budgeting and forecasting for $25M annual revenue, improving forecast accuracy by 20%\n• Conducted risk assessment and mitigation strategies, reducing financial exposure by $2M through hedging instruments\n• Collaborated with department heads on cost optimization initiatives, achieving $800K in annual savings\n• Implemented new financial reporting systems, enhancing data accuracy and reducing month-end close time by 3 days'
  ]
};

// Project templates by technology/industry
const PROJECT_TEMPLATES = {
  'react': [
    'Developed responsive e-commerce platform using React, Redux, and Node.js, handling 5,000+ daily transactions. Implemented secure payment processing with Stripe integration and real-time inventory management. Optimized application performance achieving 95+ Lighthouse scores and 2-second load times. Deployed using AWS with auto-scaling capabilities, serving 50,000+ monthly active users.',
    
    'Built comprehensive project management dashboard using React, TypeScript, and Firebase, supporting 500+ concurrent users. Created real-time collaboration features with WebSocket integration and automated notification system. Implemented role-based access control and data visualization components using D3.js. Achieved 99.5% uptime and 98% user satisfaction rating through extensive testing and monitoring.'
  ],
  
  'python': [
    'Engineered data processing pipeline using Python, Pandas, and Apache Airflow, handling 1M+ records daily. Implemented machine learning algorithms for predictive analytics, improving forecast accuracy by 35%. Created automated reporting system with email notifications and dashboard integration. Optimized processing speed by 60% through parallel computing and database indexing.',
    
    'Developed REST API using Django and PostgreSQL, serving 10,000+ requests per minute with 99.9% availability. Implemented caching strategies with Redis and database optimization techniques for improved performance. Created comprehensive test suite achieving 95% code coverage and automated deployment pipeline. Integrated third-party services including payment processing and email marketing platforms.'
  ],
  
  'aws': [
    'Architected cloud infrastructure on AWS using EC2, RDS, and S3, supporting scalable application deployment. Implemented auto-scaling groups and load balancers, handling traffic spikes of 10x normal volume. Set up monitoring and alerting systems using CloudWatch, achieving 99.9% uptime SLA. Reduced infrastructure costs by 40% through resource optimization and reserved instance planning.',
    
    'Migrated legacy systems to AWS cloud infrastructure, reducing operational costs by $200K annually. Implemented serverless architecture using Lambda and API Gateway, improving response times by 50%. Created disaster recovery and backup strategies ensuring 99.99% data availability. Established CI/CD pipelines using CodePipeline and CodeDeploy for automated deployments.'
  ]
};

/**
 * Get relevant experience template based on role and industry
 * @param {string} position - Job position/title
 * @param {Array} skills - Array of skills
 * @returns {string} - Relevant experience template
 */
export const getExperienceTemplate = (position = '', skills = []) => {
  const positionLower = position.toLowerCase();
  const skillsText = skills.join(' ').toLowerCase();
  
  let industry = 'software'; // default
  
  if (positionLower.includes('data') || positionLower.includes('analyst') || skillsText.includes('sql')) {
    industry = 'data';
  } else if (positionLower.includes('marketing') || skillsText.includes('seo')) {
    industry = 'marketing';
  } else if (positionLower.includes('finance') || skillsText.includes('excel')) {
    industry = 'finance';
  }
  
  const templates = EXPERIENCE_TEMPLATES[industry] || EXPERIENCE_TEMPLATES['software'];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

/**
 * Get relevant project template based on technologies
 * @param {Array} technologies - Array of technologies used
 * @param {string} projectType - Type of project
 * @returns {string} - Relevant project template
 */
export const getProjectTemplate = (technologies = [], projectType = '') => {
  const techText = technologies.join(' ').toLowerCase();
  const projectTypeLower = projectType.toLowerCase();
  
  let templateKey = 'react'; // default
  
  if (techText.includes('python') || techText.includes('django') || techText.includes('flask')) {
    templateKey = 'python';
  } else if (techText.includes('aws') || techText.includes('cloud') || projectTypeLower.includes('infrastructure')) {
    templateKey = 'aws';
  } else if (techText.includes('react') || techText.includes('javascript') || techText.includes('frontend')) {
    templateKey = 'react';
  }
  
  const templates = PROJECT_TEMPLATES[templateKey] || PROJECT_TEMPLATES['react'];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

/**
 * Generate dynamic metrics for templates
 * @param {string} industry - Target industry
 * @returns {Object} - Object with various metrics
 */
export const generateDynamicMetrics = (industry = 'software') => {
  const baseMetrics = {
    teamSize: Math.floor(Math.random() * 10) + 3, // 3-12 people
    improvement: Math.floor(Math.random() * 30) + 15, // 15-45%
    costSaving: Math.floor(Math.random() * 400) + 100, // $100K-$500K
    timeReduction: Math.floor(Math.random() * 50) + 20, // 20-70%
    userBase: Math.floor(Math.random() * 90) + 10, // 10K-100K users
    revenue: Math.floor(Math.random() * 2000) + 500 // $500K-$2.5M
  };
  
  // Industry-specific adjustments
  if (industry === 'finance') {
    baseMetrics.costSaving *= 2; // Higher financial impact
    baseMetrics.revenue *= 3;
  } else if (industry === 'data') {
    baseMetrics.userBase *= 10; // Larger datasets
    baseMetrics.improvement += 10; // Higher accuracy improvements
  }
  
  return baseMetrics;
};

export default {
  getExperienceTemplate,
  getProjectTemplate,
  generateDynamicMetrics,
  EXPERIENCE_TEMPLATES,
  PROJECT_TEMPLATES
};
